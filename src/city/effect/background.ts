import type { Scene } from "three";
import * as THREE from "three";
export class Background {
  private scene: Scene;
  private url: string;
  constructor(scene: Scene) {
    this.scene = scene;
    this.url = '../../src/assets/white-bg.png';
    this.init();
  }
  init() {
    // 创建纹理加载器
    const textureLoader = new THREE.TextureLoader();

    const geometry = new THREE.SphereGeometry(5000, 32,32);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: textureLoader.load(this.url)
    })

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy({
      x: 0,
      y: 0,
      z: 0
    })
    this.scene.add(sphere);
  }
}