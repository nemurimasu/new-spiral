import regl from 'regl';
import reglVr from 'regl-vr';
import mat4 from 'gl-mat4';

import vertexShader from './spiral.vert';
import fragmentShader from './spiral.frag';

const gl = regl({container: '#main-canvas', attributes: {alpha: true}});
const webVr = reglVr({regl: gl});
const startTime = Date.now();
const drawTriangle = gl({
  frag: fragmentShader,
  vert: vertexShader,
  attributes: {
    position: [[-1, -1], [-1, 4], [4, -1]]
  },
  count: 3,
  uniforms: {
    time: () => (Date.now() - startTime) / 1000.0,
    invProjection: ({projection}) => mat4.invert([], projection),
    invView: ({view}) => mat4.invert([], view)
  }
});

// normal, non-vr section
const lookAhead = mat4.lookAt([],
  [0, 0, 0],
  [0, 0, 1],
  [0, 1, 0]);
const fixView = gl({
  context: {
    projection: ({viewportWidth, viewportHeight}) => {
      return mat4.perspective([], Math.PI / 4, viewportWidth / viewportHeight, 0.1, 30);
    },
    view: lookAhead
  }
});
const {cancel: stopNormal} = gl.frame(() => {
  fixView({}, drawTriangle);
});

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
      let draw;
      draw = () => {
        vrDisplay.requestAnimationFrame(draw);
        webVr({vrDisplay}, drawTriangle);
      };

      const leftEye = vrDisplay.getEyeParameters('left');
      const rightEye = vrDisplay.getEyeParameters('right');
      Object.assign(gl._gl.canvas, {
        width: Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2,
        height: Math.max(leftEye.renderHeight, rightEye.renderHeight)
      });

      vrDisplay.requestPresent([{ source: gl._gl.canvas }]).then(() => {
        vrDisplay.requestAnimationFrame(draw);
      });
    };
    button.addEventListener('click', onClick, false);
  });
}
