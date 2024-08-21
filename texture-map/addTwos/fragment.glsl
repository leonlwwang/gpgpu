#version 300 es

precision highp float;

uniform sampler2D inTex;
uniform ivec2 outDimensions;

out vec4 outValue;

vec4 getValueFromTex(sampler2D tex, ivec2 dims, int i) {
  int y = i / dims.x;
  int x = i % dims.x;
  return texelFetch(tex, ivec2(x, y), 0);
}

void main() {
  ivec2 outPixel = ivec2(gl_FragCoord.xy);
  int outIndexAs1D = outDimensions.x * outPixel.y + outPixel.x;

  ivec2 inDimensions = textureSize(inTex, 0);

  vec4 inValue1 = getValueFromTex(inTex, inDimensions, outIndexAs1D * 2);
  vec4 inValue2 = getValueFromTex(inTex, inDimensions, outIndexAs1D * 2 + 1);

  outValue = inValue1 + inValue2;
}
