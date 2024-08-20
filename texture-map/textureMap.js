import { initShaders } from "../common/gl-init"

export const textureMap = async (canvas) => {
  const outWidth = 3
  const outHeight = 3

  canvas.width = outWidth
  canvas.height = outHeight

  const gl = canvas.getContext('webgl2')
  const vs = 'texture-map/shaders/vertex.glsl'
  const fs = 'texture-map/shaders/fragment.glsl'
  const program = await initShaders(gl, vs, fs)

  const positionLoc = gl.getAttribLocation(program, 'position')
  const srcTexLoc = gl.getUniformLocation(program, 'srcTex')

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW)

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(
    positionLoc,
    2,
    gl.FLOAT,
    false,
    0,
    0,
  )

  const srcWidth = 3
  const srcHeight = 2
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
}
