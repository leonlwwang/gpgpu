import { initShaders } from '../common/gl-init'

export const addTwosByTextureMap = async (canvas) => {
  const outWidth = 3
  const outHeight = 1
  canvas.width = outWidth
  canvas.height = outHeight

  const gl = canvas.getContext('webgl2')
  const vs = 'texture-map/addTwos/vertex.glsl'
  const fs = 'texture-map/addTwos/fragment.glsl'
  const program = await initShaders(gl, vs, fs)

  const positionLoc = gl.getAttribLocation(program, 'position')
  const inTexLoc = gl.getUniformLocation(program, 'inTex')
  const outDimensionsLoc = gl.getUniformLocation(program, 'outDimensions')

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

  const inWidth = 3
  const inHeight = 2
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.R8,
    inWidth,
    inHeight,
    0,
    gl.RED,
    gl.UNSIGNED_BYTE,
    new Uint8Array([
      1, 2, 3,
      4, 5, 6,
    ]),
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.useProgram(program)
  gl.uniform1i(inTexLoc, 0)
  gl.uniform2i(outDimensionsLoc, outWidth, outHeight)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  const results = new Uint8Array(outWidth * outHeight * 4)
  gl.readPixels(0, 0, outWidth, outHeight, gl.RGBA, gl.UNSIGNED_BYTE, results)

  const result = []
  for (let i = 0; i < outWidth * outHeight; i++) {
    result.push(results[i * 4])
  }
  return result
}
