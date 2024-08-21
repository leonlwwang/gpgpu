import { initShaders } from "../common/gl-init"

export const multArrByTextureMap = async (canvas, arr) => {
  const dstWidth = 3
  const dstHeight = 2

  canvas.width = dstWidth
  canvas.height = dstHeight

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
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.R8,
    srcWidth,
    srcHeight,
    0,
    gl.RED,
    gl.UNSIGNED_BYTE,
    new Uint8Array(arr),
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.useProgram(program)
  gl.uniform1i(srcTexLoc, 0)

  gl.drawArrays(gl.TRIANGLES, 0, 6)

  const results = new Uint8Array(dstWidth * dstHeight * 4)
  gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results)

  const result = []
  for (let i = 0; i < dstWidth * dstHeight; i++) {
    result.push(results[i * 4])
  }
  console.log(result)
  return result
}
