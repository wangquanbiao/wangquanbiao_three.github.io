import * as THREE from 'three'
export class Cylinder {
  private scene: THREE.Scene
  private time: {
    value: number
  }
  constructor(scene: THREE.Scene, time: any) {
    this.scene = scene
    this.time = time
  }
  createCylinder(option: any) {
    const geometry = new THREE.CylinderGeometry(
      option.radius,
      option.radius,
      option.height,
      32,
      1,
      option.open,
    )
    geometry.translate(0, option.height / 2, 0)
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
