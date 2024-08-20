import { initShaders } from "../common/gl-init"

export const textureMap = async (canvas) => {
  const outWidth = 3
  const outHeight = 3

  canvas.width = outWidth
  canvas.height = outHeight

  const gl = canvas.getContext('webgl2')
  const vs = 'texture-map/shaders/vertex.glsl'
  const fs = 'texture-map/shaders/fragment.glsl'
  const program = await initShaders(gl, vs, fs)
}
