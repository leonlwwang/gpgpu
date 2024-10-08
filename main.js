import './style.css'
import { particles } from './particles/particles'
import { addSubMul } from './texture-map-tf/addSubMul'
import { addTwosByTextureMap } from './texture-map/addTwos'
import { multArrByTextureMap } from './texture-map/multArr'

/* part (1.0): multiply 2 over array w/ fs */
const canvasA = document.createElement('canvas')
document.body.appendChild(canvasA)

const arr = [1, 2, 3, 4, 5, 6, 7, 8]
await multArrByTextureMap(canvasA, arr).then((res) => console.log(res))

/* part (1.1): add every 2 indices w/ fs */
const canvasB = document.createElement('canvas')
document.body.appendChild(canvasB)

await addTwosByTextureMap(canvasB).then((res) => console.log(res))

/* part (2): add, sub, mul 2 arrays w/ tf + fs */
const canvasC = document.createElement('canvas')
document.body.appendChild(canvasC)

await addSubMul(canvasC).then((res) => console.log(res))

/* part (3): particule simulation with tf */
const canvasD = document.createElement('canvas')
document.body.appendChild(canvasD)

await particles(canvasD).then((res) => console.log(res))
