import regl from 'regl';
import reglVr from 'regl-vr';
import mat4 from 'gl-mat4';
import quat from 'gl-quat';

import vertexShader from './spiral.vert';
import fragmentShader from './spiral.frag';

const gl = regl({container: '#main-canvas', attributes: {alpha: true}});
const webVr = reglVr({regl: gl});
const startTime = Date.now();
const invProjection = mat4.create();
const invView = mat4.create();
const invModel = mat4.create();
const drawTriangle = gl({
  frag: fragmentShader,
  vert: vertexShader,
  attributes: {
    position: [[-1, -1], [-1, 4], [4, -1]]
  },
  count: 3,
  uniforms: {
    // 1.0 matches the spiral period as defined by spiral.frag.
    // without this division, the spiral will become choppy over time,
    // especially on mobile GPUs.
    time: ({time}) => time % 1.0,
    invProjection: ({projection}) => mat4.invert(invProjection, projection),
    invView: ({view}) => mat4.invert(invView, view),
    invModel: () => mat4.invert(invModel, modelTransform)
  }
});

const modelTransform = mat4.create();

// normal, non-vr section
const normalProjection = mat4.create();
const lookAhead = mat4.lookAt(mat4.create(),
  [0, 0, 0],
  [0, 0, -1],
  [0, 1, 0]);
const fixView = gl({
  context: {
    projection: ({viewportWidth, viewportHeight}) => {
      return mat4.perspective(normalProjection, Math.PI / 4, viewportWidth / viewportHeight, 0.01, 10000);
    },
    view: lookAhead
  }
});
const {cancel: stopNormal} = gl.frame(() => fixView(drawTriangle));

if (navigator.getVRDisplays) {
  navigator.getVRDisplays().then((vrDisplays) => {

    if (vrDisplays.length === 0) {
      return;
    }
    // what if somebody has multiple VR displays? how are we supposed to choose?

    const vrDisplay = vrDisplays[0];
    console.log(`VR display detected: ${vrDisplay.displayName}`);

    const button = document.getElementById('vr-button');
    button.style.display = 'block';
    let onClick;
    onClick = (event) => {
      button.removeEventListener('click', onClick);
      delete button.style.display;
      event.preventDefault();

      stopNormal();

      const leftEye = vrDisplay.getEyeParameters('left');
      const rightEye = vrDisplay.getEyeParameters('right');
      const canvasParams = {
        width: Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2,
        height: Math.max(leftEye.renderHeight, rightEye.renderHeight)
      };

      vrDisplay.requestPresent([{ source: gl._gl.canvas }]).then(() => {
        let updateVr;
        const frameData = new VRFrameData();
        const modelTranslation = new Float32Array(3);
        const modelRotation = quat.create();
        // without gl.frame, apparently the time context needs manual updating
        const fixTime = gl({
          context: {
            time: gl.prop('time')
          }
        });
        const webVrParam = {vrDisplay};
        const render = () => webVr(webVrParam, drawTriangle);
        let lastTime = 0.0;
        const clearParams = {depth: 1};
        const timeParam = {time: 0.0};
        updateVr = (time) => {
          vrDisplay.requestAnimationFrame(updateVr);

          // make sure window resizes don't ruin the spiral
          Object.assign(gl._gl.canvas, canvasParams);

          // move spiral to stay in view
          const dt = time - lastTime;
          lastTime = time;
          vrDisplay.getFrameData(frameData);
          const vrPose = frameData.pose;
          if (vrPose) {
            const factor = Math.min(0.00025 * dt, 1.0);
            const vrPos = vrPose.position;
            if (vrPos) {
              for (let axis = 0; axis < 3; axis++) {
                modelTranslation[axis] += (vrPos[axis] - modelTranslation[axis]) * factor;
              }
            }
            const vrRot = vrPose.orientation;
            if (vrRot) {
              quat.slerp(modelRotation, modelRotation, vrRot, factor);
            }
            mat4.fromRotationTranslation(modelTransform, modelRotation, modelTranslation);
          }

          // this is required for the webvr polyfill
          gl.clear(clearParams);
          timeParam.time = time / 1000.0;
          fixTime(timeParam, render);
          // required for polyfill
          gl._refresh();
        };
        vrDisplay.requestAnimationFrame(updateVr);
      });
    };
    button.addEventListener('click', onClick, false);
  });
}
