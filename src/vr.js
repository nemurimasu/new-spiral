import WebVRPolyfill from 'webvr-polyfill';

new WebVRPolyfill({
  MOUSE_KEYBOARD_CONTROLS_DISABLED: true,
  DIRTY_SUBMIT_FRAME_BINDINGS: true,
  ROTATE_INSTRUCTIONS_DISABLED: true
});


const reglVr = require('regl-vr');

export default function (gl) {
  return reglVr({ regl: gl });
}
