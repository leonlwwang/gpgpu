/* creates a frag and a vertex shader binded to a program */
export const initShaders = async (gl, vs, fs) => {
  const vertexShader = await initShader(gl, gl.VERTEX_SHADER, vs)
  const fragmentShader = await initShader(gl, gl.FRAGMENT_SHADER, fs)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramParameter(shaderProgram))
  }

  return shaderProgram
}

/* creates an individual frag or vertex shader */
export const initShader = async (gl, type, path) => {
  const source = await fetch(path).then((response) => response.text())
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader))
  }
  return shader
}
