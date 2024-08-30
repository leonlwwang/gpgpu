import { initShader, makeBuffer } from '../common/gl-init'

export const addSubMul = async (canvas) => {
  const gl = canvas.getContext('webgl2')

  const vsPath = 'texture-map-tf/addSubMul/vertex.glsl'
  const fsPath = 'texture-map-tf/addSubMul/fragment.glsl'
  const vs = await initShader(gl, gl.VERTEX_SHADER, vsPath)
  const fs = await initShader(gl, gl.FRAGMENT_SHADER, fsPath)

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

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

  /* must unbind buffers from non-tf targets before doing tf */
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  gl.useProgram(program)
  gl.bindVertexArray(vao)

  gl.enable(gl.RASTERIZER_DISCARD)

  /* execute tf */
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf)
  gl.beginTransformFeedback(gl.POINTS)
  gl.drawArrays(gl.POINTS, 0, a.length)
  gl.endTransformFeedback()
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

  gl.disable(gl.RASTERIZER_DISCARD)

  let sb = String()
  sb += `a: ${a}\n`
  sb += `b: ${b}\n`

  const loadResult = (gl, buffer, label) => {
    const result = new Float32Array(a.length)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    /* accesses buffers that tf wrote to */
    gl.getBufferSubData(
      gl.ARRAY_BUFFER,
      0,
      result,
    )
    sb += `${label}: ${result}\n`
  }

  loadResult(gl, sum, 'a + b')
  loadResult(gl, diff, 'a - b')
  loadResult(gl, mul, 'a * b')

  return sb
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
