#version 300 es

in vec2 inPosition;
in vec2 inVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 outPosition;

vec2 euclidianModulo(vec2 n, vec2 m) {
  return mod(mod(n, m) + m, m);
}

void main() {
  outPosition = euclidianModulo(
    inPosition + inVelocity * deltaTime,
    canvasDimensions
  );
}
