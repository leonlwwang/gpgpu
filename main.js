import './style.css'
import { addTwosByTextureMap } from './texture-map/addTwos'
import { multArrByTextureMap } from './texture-map/multArr'

/* part (1.0): multiply 2 over array w/ frag shader */
const canvasA = document.createElement('canvas')
document.body.appendChild(canvasA)

const arr = [1, 2, 3, 4, 5, 6, 7, 8]
await multArrByTextureMap(canvasA, arr).then((res) => console.log(res))

/* part (1.1): add every 2 indices w/ frag shader */
const canvasB = document.createElement('canvas')
document.body.appendChild(canvasB)

await addTwosByTextureMap(canvasB).then((res) => console.log(res))

/* part (2): add, sub, mult 2 arrays w/ tf + fs */
const canvasC = document.createElement('canvas')
document.body.appendChild(canvasC)
