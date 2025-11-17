import * as THREE from 'three'
import { Points } from './points'
interface CustomVector3 extends THREE.Vector3 {
  speedX?: number
  speedY?: number
  speedZ?: number
}
export class Rain {
  private scene: THREE.Scene
  private points: Points
  constructor(scene: THREE.Scene) {
    this.scene = scene
    const range = 1000
    this.points = new Points(scene, {
      count: 800,
      range: range,
      size: 15,
      url: '../../src/assets/rain.png',
      opacity: 0.5,
      setPosition: (position: CustomVector3) => {
        position.speedY = Math.random() + 0.4
      },
      setAnmiation: (position: CustomVector3) => {
        position.y -= position.speedY!
      if (position.y <= 0) {
        position.y = range / 2
      }
      }
    })
  }
  anmiation() {
    this.points.anmiation()
  }
}