/* creates a frag and a vertex shader binded to a program with options for tf */
export const initShaders = async (gl, vs, fs, tf = []) => {
  const vertexShader = await initShader(gl, gl.VERTEX_SHADER, vs)
  const fragmentShader = await initShader(gl, gl.FRAGMENT_SHADER, fs)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)

  if (tf.length > 0) {
    gl.transformFeedbackVaryings(
      shaderProgram,
      tf,
      gl.SEPARATE_ATTRIBS,
    )
  }

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

/* creates a gl buffer to hold data */
export const makeBuffer = (gl, sizeOrData, usage = null) => {
  const drawMode = usage ?? gl.STATIC_DRAW
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, drawMode)
  return buf
}

/* makes a vao based on buffer and location */
export const makeVao = (gl, bufsAndLocs) => {
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  for (const [buf, loc] of bufsAndLocs) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(
      loc,
      2,
      gl.FLOAT,
      false,
      0,
      0,
    )
  }
  return vao
}

/* creates a transform feedback from a buffer */
export const makeTf = (gl, buffer) => {
  const tf = gl.createTransformFeedback()
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer)
  return tf
}
