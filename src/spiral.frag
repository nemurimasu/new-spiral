precision mediump float;

const float c_TubeWidth = 3.0;
const float c_Pi = 3.14159265358979;

uniform float time;

varying vec3 worldPos;

float spiralColor() {
  vec3 ray = normalize(worldPos);
  float a = dot(ray.xy, ray.xy);
  float b = 2.0 * dot(ray.xy, vec2(0.0, 0.0));
  float c = -c_TubeWidth * c_TubeWidth;
  float test = b * b - 4.0 * a * c;
  if (test < 0.0) return 0.5;
  vec2 intersection = ray.xy * (-b - sqrt(test)) / (2.0 * a);
  float angle = atan(intersection.y, intersection.x);
  float depth = ray.z * length(intersection) / length(ray.xy);
  return step(0.5, mod(depth * 0.1 + angle / c_Pi - time, 1.0)) * 2.0 / max(1.0, pow(depth, 0.75));
}

void main() {
  gl_FragColor = vec4(vec3(spiralColor()), 1.0);
}
