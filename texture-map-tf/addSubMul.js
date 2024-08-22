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
  
}