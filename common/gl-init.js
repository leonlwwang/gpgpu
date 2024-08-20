export const initShaders = async (gl, vs, fs) => {
  const importShader = async (gl, type, path) => {
    const source = await fetch(path).then((response) => response.text())
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`)
      gl.deleteShader(shader)
      return null
    }
    return shader
  }
  const vertexShader = await importShader(gl, gl.VERTEX_SHADER, vs)
  const fragmentShader = await importShader(gl, gl.FRAGMENT_SHADER, fs)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(`Failed to link program: ${gl.getProgramInfoLog(shaderProgram)}`)
    return null
  }

  return shaderProgram
}
