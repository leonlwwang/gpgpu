import { initShaders, makeBuffer } from "../common/gl-init"

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
  const velocityBuf = makeBuffer(gl, velocities, gl.STATIC_DRAW)

  
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
