import * as THREE from 'three'
import { Points } from './points'
interface CustomVector3 extends THREE.Vector3 {
  speedX?: number
  speedY?: number
  speedZ?: number
}
export class Snow {
  private scene: THREE.Scene
  private points: Points
  // private setPosition: (position: CustomVector3) => void
  // private setAnimation: (position: CustomVector3) => void
  constructor(scene: THREE.Scene) {
    this.scene = scene
    const range = 1000
    this.points = new Points(scene, {
      range: range,
      count: 600,
      size: 30,
      opacity: 0.8,
      url: '../../src/assets/snow.png',
      setPosition: (position: CustomVector3) => {
        position.speedX = Math.random() - 0.5
        position.speedY = Math.random() + 0.4
        position.speedZ = Math.random() - 0.5
      },
      setAnmiation: (position: CustomVector3) => {
        position.x -= position.speedX!
        position.y -= position.speedY!
        position.z -= position.speedZ!
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