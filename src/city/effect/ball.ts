import * as THREE from 'three'
import { color } from '../config'
export class Ball {
  private scene: THREE.Scene
  private time: {
    value: number
  }
  constructor(scene: THREE.Scene, time: any) {
    this.scene = scene
    this.time = time
    this.createSphere({
      height: 60,
      color: color.ball,
      opacity: 0.6,
      speed: 4,
      position: {
        x: 300,
        y: 0,
        z: -200,
      },
    })
  }
  createSphere(option: any) {
    const geometry = new THREE.SphereGeometry(
      50,
      32,
      32,
      Math.PI / 2,
      Math.PI * 2,
      0,
      Math.PI / 2,
    )
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: this.time,
        u_color: {
          value: new THREE.Color(option.color),
        },
        u_height: {
          value: option.height,
        },
        u_opacity: {
          value: option.opacity,
        },
        u_speed: {
          value: option.speed,
        }
      },
      vertexShader: `
        uniform float u_height;
        uniform float u_time;
        varying float v_opacity;
        uniform float u_speed;
        void main() {
          vec3 pos = position * mod(u_time / u_speed, 1.0);
          v_opacity = mix(1.0, 0.0, position.y / u_height);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float u_opacity;
        uniform vec3 u_color;
        varying float v_opacity;
        void main() {
          gl_FragColor = vec4(u_color, u_opacity * v_opacity);
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
