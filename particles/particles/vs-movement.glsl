#version 300 es

in vec2 inPosition;
in vec2 inVelocity;

uniform float deltaTime;
uniform vec2 canvasDimensions;

out vec2 outPosition;
out vec2 outVelocity;

vec2 euclidianModulo(vec2 n, vec2 m) {
  return mod(mod(n, m) + m, m);
}

void main() {
  vec2 newPosition = inPosition + inVelocity * deltaTime;
  vec2 newVelocity = inVelocity;

  if (newPosition.x < 0.0 || newPosition.x > canvasDimensions.x) {
    newVelocity.x = inVelocity.x * -1.0;
    newPosition.x = inPosition.x + newVelocity.x * deltaTime;
  }
  if (newPosition.y < 0.0 || newPosition.y > canvasDimensions.y) {
    newVelocity.y = inVelocity.y * -1.0;
    newPosition.y = inPosition.y + newVelocity.y * deltaTime;
  }
    
  outPosition = euclidianModulo(newPosition, canvasDimensions);
  outVelocity = newVelocity;
}
