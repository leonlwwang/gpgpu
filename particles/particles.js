import { initShaders, makeBuffer, makeTf, makeVao } from "../common/gl-init"

export const particles = async (canvas) => {
  canvas.width = 300
  canvas.height = 300

  const gl = canvas.getContext('webgl2')

  const movementProgram = await initShaders(
    gl,
    'particles/particles/vs-movement.glsl',
    'particles/particles/fs-movement.glsl',
    ['outPosition']
  )
  const renderProgram = await initShaders(
    gl,
    'particles/particles/vs-render.glsl',
    'particles/particles/fs-render.glsl',
  )

  const movementProgramLocs = {
    inPosition: gl.getAttribLocation(movementProgram, 'inPosition'),
    inVelocity: gl.getAttribLocation(movementProgram, 'inVelocity'),
    canvasDimensions: gl.getUniformLocation(movementProgram, 'canvasDimensions'),
    deltaTime: gl.getUniformLocation(movementProgram, 'deltaTime'),
  }

  const renderProgramLocs = {
    inPosition: gl.getAttribLocation(renderProgram, 'inPosition'),
    matrix: gl.getUniformLocation(renderProgram, 'matrix'),
  }

  const nParticles = 200
  const { points, velocities } = randomPointsAndVelocities(nParticles, canvas)

  const position1Buf = makeBuffer(gl, points, gl.DYNAMIC_DRAW)
  const position2Buf = makeBuffer(gl, points, gl.DYNAMIC_DRAW)
  const velocityBuf = makeBuffer(gl, velocities)

  const position1Vao = makeVao(gl, [
    [position1Buf, movementProgramLocs.inPosition],
    [velocityBuf, movementProgramLocs.inVelocity],
  ])
  const position2Vao = makeVao(gl, [  
    [position2Buf, movementProgramLocs.inPosition],
    [velocityBuf, movementProgramLocs.inVelocity],
  ])

  const draw1Vao = makeVao(gl, [
    [position1Buf, renderProgramLocs.inPosition],
  ])
  const draw2Vao = makeVao(gl, [
    [position2Buf, renderProgramLocs.inPosition],
  ])

  const tf1 = makeTf(gl, position1Buf)
  const tf2 = makeTf(gl, position2Buf)

  // remember to unbind everything before executing tf
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)

  let curr = {
    points: position1Vao,
    tf: tf2,
    render: draw2Vao,
  }
  let next = {
    points: position2Vao,
    tf: tf1,
    render: draw1Vao,
  }

  // animation loop
  let then = 0
  const render = (time) => {
    time *= 0.001
    const deltaTime = time - then
    then = time

    gl.clear(gl.COLOR_BUFFER_BIT)

    // update to new positions
    gl.useProgram(movementProgram)
    gl.bindVertexArray(curr.points)
    gl.uniform2f(movementProgramLocs.canvasDimensions, gl.canvas.width, gl.canvas.height)
    gl.uniform1f(movementProgramLocs.deltaTime, deltaTime)

    // stop drawing on screen before executing tf
    gl.enable(gl.RASTERIZER_DISCARD)

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, curr.tf)
    gl.beginTransformFeedback(gl.POINTS)
    gl.drawArrays(gl.POINTS, 0, nParticles)
    gl.endTransformFeedback()
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

    gl.disable(gl.RASTERIZER_DISCARD)

    // render to screen
    gl.useProgram(renderProgram)
    gl.bindVertexArray(curr.render)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.uniformMatrix4fv(
      renderProgramLocs.matrix,
      false,
      projectionMatUtil(0, gl.canvas.width, 0, gl.canvas.height, -1, 1),
    )
    gl.drawArrays(gl.POINTS, 0, nParticles)

    // swap buffers
    {
      const temp = curr
      curr = next
      next = temp
    }

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}

const randomPointsAndVelocities = (n, canvas) => {
  const rand = (min, max) => {
    if (max == undefined) {
      max = min
      min = 0
    }
    return Math.random() * (max - min) + min
  }
  const makePoints = (ranges) =>
    new Array(n).fill(0).map(_ => ranges.map(range => rand(...range))).flat()
  const points = new Float32Array(makePoints([[canvas.width], [canvas.height]]))
  const velocities = new Float32Array(makePoints([[-300, 300], [-300, 300]]))
  return { points, velocities }
}

const projectionMatUtil = (left, right, bottom, top, near, far) => {
  const mat = new Float32Array(16)
  mat.fill(0)

  mat[0] = 2 / (right - left)
  mat[5] = 2 / (top - bottom)
  mat[10] = 2 / (near - far)
  mat[12] = (left + right) / (left - right)
  mat[13] = (bottom + top) / (bottom - top)
  mat[14] = (near + far) / (near - far)
  mat[15] = 1

  return mat
}
