import './style.css'
import { multArrByTextureMap } from './texture-map/textureMap'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const arr = [1, 2, 3, 4, 5, 6]
multArrByTextureMap(canvas, arr)
