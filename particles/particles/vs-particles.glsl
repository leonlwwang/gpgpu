#version 300 es

in vec4 inPosition;
uniform mat4 matrix;

void main() {
  gl_Position = matrix * inPosition;
  gl_PointSize = 10.0;
}
