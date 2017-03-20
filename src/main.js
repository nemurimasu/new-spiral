import regl from 'regl';
import webVr from 'regl-vr';
import mat4 from 'gl-mat4';

import vertexShader from './spiral.vert';
import fragmentShader from './spiral.frag';

const gl = regl({container: '#main-canvas', attributes: {alpha: true}});
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
    screenSize: ({viewportWidth, viewportHeight}) => [viewportWidth, viewportHeight],
    invProjection: ({viewportWidth, viewportHeight}) => {
      return mat4.invert([], mat4.perspective([], Math.PI / 4, viewportWidth / viewportHeight, 0.1, 30))
    },
    invView: mat4.invert([], mat4.lookAt([],
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 0]))
  }
});
gl.frame(drawTriangle);
