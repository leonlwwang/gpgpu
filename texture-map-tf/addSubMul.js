import { initShader } from '../common/gl-init'

export const addSubMul = async () => {
  const vsPath = 'texture-map-tf/addSubMul/vertex.glsl'
  const fsPath = 'texture-map-tf/addSubMul/fragment.glsl'
  const vs = initShader(gl, gl.VERTEX_SHADER, vsPath)
  const fs = initShader(gl, gl.FRAGMENT_SHADER, fsPath)

  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)

  /* prepare tf */
  const varyings = ['sum', 'diff', 'mul']
  gl.transformFeedbackVaryings(
    program,
    varyings,
    gl.SEPARATE_ATTRIBS,
  )

  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramParameter(program))
  }

  const aLoc = gl.getAttribLocation(program, 'a')
  const bLoc = gl.getAttribLocation(program, 'b')

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  const a = [1, 2, 3, 4, 5, 6]
  const b = [3, 6, 9, 12, 15, 18]
  makeBufferAndSetAttrib(gl, new Float32Array(a), aLoc)
  makeBufferAndSetAttrib(gl, new Float32Array(b), bLoc)

  /* set up tf */
  const tf = gl.createTransformFeedback()
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)

  const sum = makeBuffer(gl, a.length * 4)
  const diff = makeBuffer(gl, a.length * 4)
  const mul = makeBuffer(gl, a.length * 4)
  
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, sum)
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, diff)
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, mul)

  gl.useProgram(program)
  gl.bindVertexArray(vao)

  gl.enable(gl.RASTERIZER_DISCARD)

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
  gl.beginTransformFeedback(gl.POINTS)
  gl.drawArrays(gl.POINTS, 0, a.length)
  gl.endTransformFeedback()
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

  gl.disable(gl.RASTERIZER_DISCARD)

  console.log(`a: ${a}`)
  console.log(`b: ${b}`)

  const printResult = (gl, buffer, label) => {
    const result = new Float32Array(a.length)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.getBufferSubData(
      gl.ARRAY_BUFFER,
      0,
      result,
    )
    console.log(`${label}: ${result}`)
  }

  printResult(gl, sum, 'a + b')
  printResult(gl, diff, 'a - b')
  printResult(gl, mul, 'a * b')
}

const makeBuffer = (gl, sizeOrData) => {
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferdata(gl.ARRAY_BUFFER, sizeOrData, gl.STATIC_DRAW)
  return buf
}

const makeBufferAndSetAttrib = (gl, data, loc) => {
  const buf = makeBuffer(gl, data)
  
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(
    loc,
    1,
    gl.FLOAT,
    false,
    0,
    0,
  )
  return buf
}
