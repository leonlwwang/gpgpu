#version 300 es

in vec2 inPosition;
in vec2 inVelocity;
in int pointIndex;

uniform float deltaTime;
uniform vec2 canvasDimensions;
uniform sampler2D pointsTex;
uniform int texLength;

out vec2 outPosition;
out vec2 outVelocity;

vec2 euclidianModulo(vec2 n, vec2 m) {
  return mod(mod(n, m) + m, m);
}

vec4 getPoint(sampler2D tex, ivec2 dims, int i) {
  int y = i / dims.x;
  int x = i % dims.x;
  return texelFetch(tex, ivec2(x, y), 0);
}

bool collides(vec2 point) {
  // check point collision
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

  /* 
    for every texel in allPoints, fetch the truncated vec2 (x, y)
    then check if the point collided with the current point
  */
  ivec2 texDimensions = textureSize(pointsTex, 0)
  for (int i = 0; i < texLength; ++i) {
    if (i != pointIndex) {
      vec2 point = getPoint(pointsTex, texDimensions, i * 2).xy;
      if (collides(point)) {
        newVelocity.xy = inVelocity.xy * -1.0;
        newPosition.xy = inPosition.xy + newVelocity.xy * deltaTime;
      }
    }
  }
    
  outPosition = euclidianModulo(newPosition, canvasDimensions);
  outVelocity = newVelocity;
}
