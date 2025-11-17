import * as THREE from "three";
export class Room {
  private name: string
  private scene: THREE.Scene
  private position: THREE.Vector3
  private euler: THREE.Euler
  private roomPrefix: string
  constructor(name: string, scene: THREE.Scene, roomPrefix: string, position?: THREE.Vector3, euler?: THREE.Euler) {
    this.scene = scene
    this.name = name
    this.position = position || new THREE.Vector3(0, 0, 0)
    this.euler = euler || new THREE.Euler(0, 0, 0)
    this.roomPrefix = roomPrefix
    this.init()
  }
  init () {
     const materials: THREE.MeshBasicMaterial[] = []
     const arr = [
       `${this.roomPrefix}_r`,
       `${this.roomPrefix}_l`,
       `${this.roomPrefix}_u`,
       `${this.roomPrefix}_d`,
       `${this.roomPrefix}_f`,
       `${this.roomPrefix}_b`,
     ]
    arr.forEach(item => {
      const texture = new THREE.TextureLoader().load(item + ".jpg");
      const material = new THREE.MeshBasicMaterial({ map: texture });
      materials.push(material);
    })
   
    // 创建几何体
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    // 创建网格
    const box = new THREE.Mesh(geometry, materials);
    box.geometry.scale(1, 1, -1);
    box.position.copy(this.position);
    box.rotation.copy(this.euler);
    this.scene.add(box);
  }
}