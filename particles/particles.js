import { initShaders } from "../common/gl-init"

export const particles = async (canvas) => {
  const gl = canvas.getContext('webgl2')

  const movementProgram = initShaders(
    gl,
    'particles/particles/vs-movement.glsl',
    'particles/particles/fs-movement.glsl',
    ['outPosition']
  )
  const renderProgram = initShaders(
    gl,
    'particles/particles/vs-render.glsl',
    'particles/particles/fs-render.glsl',
  )


}