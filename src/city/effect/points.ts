import * as THREE from 'three'
interface CustomVector3 extends THREE.Vector3 {
  speedX?: number
  speedY?: number
  speedZ?: number
}
interface PointsOption {
  range: number
  count: number
  url: string
  size: number
  opacity: number
  setPosition: (position: CustomVector3) => void
  setAnmiation: (position: CustomVector3) => void
}
export class Points {
  private scene: THREE.Scene
  private range: number
  private count: number
  private url: string
  private size: number
  private opacity: number
  private setPosition: (position: CustomVector3) => void
  private setAnmiation: (position: CustomVector3) => void
  private material: THREE.PointsMaterial | null
  private geometry: THREE.BufferGeometry | null
  private pointList: CustomVector3[]
  private point: THREE.Points | null
  constructor(scene: THREE.Scene, {range, count, url, size, opacity, setPosition, setAnmiation}: PointsOption) {
    this.scene = scene
    this.range = range
    this.count = count
    this.url = url
    this.size = size
    this.opacity = opacity
    this.setPosition = setPosition
    this.setAnmiation = setAnmiation
    this.material = null
    this.geometry = null
    this.point = null
    this.pointList = []
    this.createSnow()
  }
  createSnow() {
    this.material = new THREE.PointsMaterial({
      size: this.size,
      map: new THREE.TextureLoader().load(this.url),
      transparent: true,
      opacity: this.opacity,
      depthTest: false,
    })
    this.geometry = new THREE.BufferGeometry()
    for(let i = 0; i < this.count; i++) {
      const position: CustomVector3 = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2
      )
      this.setPosition(position)

      this.pointList.push(position)
    }
    this.geometry.setFromPoints(this.pointList)
    this.point = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.point)
  }
  anmiation() {
    this.pointList.forEach((position) => {
      this.setAnmiation(position)
      this.point?.geometry.setFromPoints(this.pointList)
    })
  }
}