import * as THREE from 'three'
import { color } from '../config'
export class Cone {
  private scene: THREE.Scene
  private height: {
    value: number
  }
  private top: {
    value: number
  }
  constructor(scene: THREE.Scene, height: any, top: any) {
    this.scene = scene
    this.height = height
    this.top = top
    this.createCone({
      color: color.cone,
      position: {
        x: 0,
        y: 50,
        z: 0,
      },
    })
  }
  createCone(option: any) {
    const geometry = new THREE.ConeGeometry(
      15,
      30,
      4,
    )
    geometry.rotateZ(Math.PI)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(option.color),
        },
        u_height: this.height,
        u_top: this.top,
      },
      vertexShader: `
        uniform float u_height;
        uniform float u_top;
        void main() {
          float f_angle = u_height / 10.0;
          float new_x = position.x * cos(f_angle) - position.z * sin(f_angle);
          float new_z = position.x * sin(f_angle) + position.z * cos(f_angle);
          float new_y = position.y;
          vec4 pos = vec4(new_x, new_y + u_top, new_z, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * pos;
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        void main() {
          gl_FragColor = vec4(u_color, 0.6);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(option.position)
    this.scene.add(mesh)
  }
}
