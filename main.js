import './style.css'
import { textureMap } from './texture-map/textureMap'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
textureMap(canvas)
