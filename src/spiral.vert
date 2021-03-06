precision mediump float;

uniform mat4 invProjection, invView, invModel;

attribute vec2 position;

varying vec3 worldPos;

void main() {
  gl_Position = vec4(position, -1.0, 1.0);
  worldPos = (invModel * (invView * vec4((invProjection * vec4(position, -1.0, 1.0)).xy, -1, 0.0))).xyz;
}
