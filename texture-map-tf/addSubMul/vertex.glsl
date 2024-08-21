#version 300 es

in float a;
in float b;

out float sum;
out float diff;
out float mul;

void main() {
  sum = a + b;
  diff = a - b;
  mul = a * b;
}
