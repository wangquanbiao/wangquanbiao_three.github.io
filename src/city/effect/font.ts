import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
export class CreateFont {
  private scene: THREE.Scene;
  private font: Font | null;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.font = null;
    this.init();
  }
  init() {
    const loader = new FontLoader()
    loader.load('/font.json', (font: Font) => {
      this.font = font;
      console.log('font', font)

      // 创建字体几何体了
      this.createTextQueue()
    })
  }
  createTextQueue() {
    const textList = [
      {
        text: '最高的楼',
        size: 20,
        position: {
          x: -10,
          y: 130,
          z: 410,
        },
        rotate: Math.PI / 1.3,
        color: '#ff0000',
      },
      {
        text: '第二高楼',
        size: 20,
        position: {
          x: 180,
          y: 110,
          z: -70,
        },
        rotate: Math.PI / 2,
        color: '#ffff00',
      }
    ]
    textList.forEach((item) => {
      this.createText(item)
    })
  }
  createText(option: any) {
     const geometry = new TextGeometry(option.text, {
      font: this.font as Font,
      size: option.size,
      depth: 2
    })
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(option.color),
        }
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        void main() {
          gl_FragColor = vec4(u_color, 1.0);
        }
      `
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(option.position)
    mesh.rotateY(option.rotate)
    this.scene.add(mesh)
  }
}