import { initShaders, makeBuffer, makeTexture, makeTf, makeVao } from "../common/gl-init"

export const particles = async (canvas) => {
  canvas.width = 600
  canvas.height = 600

  const gl = canvas.getContext('webgl2')

  const movementProgram = await initShaders(
    gl,
    'particles/particles/vs-movement.glsl',
    'particles/particles/fs-movement.glsl',
    ['outPosition', 'outVelocity']
  )
  const renderProgram = await initShaders(
    gl,
    'particles/particles/vs-render.glsl',
    'particles/particles/fs-render.glsl',
  )

  const nParticles = 200
  const { points, velocities } = randomPointsAndVelocities(nParticles, canvas)

  // prepare texture for collision checking
  makeTexture(gl, points, 2)

  const movementProgramLocs = {
    inPosition: gl.getAttribLocation(movementProgram, 'inPosition'),
    inVelocity: gl.getAttribLocation(movementProgram, 'inVelocity'),
    pointIndex: gl.getAttribLocation(movementProgram, 'pointIndex'),
    deltaTime: gl.getUniformLocation(movementProgram, 'deltaTime'),
    canvasDimensions: gl.getUniformLocation(movementProgram, 'canvasDimensions'),
    pointsTex: gl.getUniformLocation(movementProgram, 'pointsTex'),
    texLength: gl.getUniformLocation(movementProgram, 'texLength'),
  }

  const renderProgramLocs = {
    inPosition: gl.getAttribLocation(renderProgram, 'inPosition'),
    matrix: gl.getUniformLocation(renderProgram, 'matrix'),
  }

  const position1Buf = makeBuffer(gl, points, gl.DYNAMIC_DRAW)
  const position2Buf = makeBuffer(gl, points, gl.DYNAMIC_DRAW)
  const velocity1Buf = makeBuffer(gl, velocities, gl.DYNAMIC_DRAW)
  const velocity2Buf = makeBuffer(gl, velocities, gl.DYNAMIC_DRAW)

  const position1Vao = makeVao(gl, [
    [position1Buf, movementProgramLocs.inPosition],
    [velocity1Buf, movementProgramLocs.inVelocity],
  ])
  const position2Vao = makeVao(gl, [  
    [position2Buf, movementProgramLocs.inPosition],
    [velocity2Buf, movementProgramLocs.inVelocity],
  ])

  const draw1Vao = makeVao(gl, [
    [position1Buf, renderProgramLocs.inPosition],
  ])
  const draw2Vao = makeVao(gl, [
    [position2Buf, renderProgramLocs.inPosition],
  ])

  const tf1 = makeTf(gl, position1Buf)
  const tf2 = makeTf(gl, position2Buf)

  // texture index tracker to pass into vs
  const indices = new Int32Array(Array.from({ length: nParticles }, (_, i) => i))
  const indicesBuf = makeBuffer(gl, indices)
  makeVao(gl, [
    [indicesBuf, movementProgramLocs.pointIndex],
  ], true)

  // remember to unbind everything before executing tf
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null)

  let curr = {
    points: position1Vao,
    velocities: velocity1Buf,
    // tf: tf2,
    positionBuf: position2Buf,
    velocityBuf: velocity2Buf,
    render: draw2Vao,
  }
  let next = {
    points: position2Vao,
    velocities: velocity2Buf,
    // tf: tf1,
    positionBuf: position1Buf,
    velocityBuf: velocity1Buf,
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
    gl.uniform1f(movementProgramLocs.deltaTime, deltaTime)
    gl.uniform2f(movementProgramLocs.canvasDimensions, gl.canvas.width, gl.canvas.height)
    gl.uniform1i(movementProgramLocs.pointsTex, 0)
    gl.uniform1f(movementProgramLocs.texLength, points.length)

    // stop drawing on screen before executing tf
    gl.enable(gl.RASTERIZER_DISCARD)

    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, curr.positionBuf)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, curr.velocityBuf)

    // gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, curr.tf)
    gl.beginTransformFeedback(gl.POINTS)
    gl.drawArrays(gl.POINTS, 0, nParticles)
    gl.endTransformFeedback()
    // gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null)

    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null)
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null)

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
