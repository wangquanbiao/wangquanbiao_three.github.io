import * as THREE from 'three'
import { color } from '../config'
export class Road {
  private scene: THREE.Scene
  private time: {
    value: number
  }
  constructor(scene: THREE.Scene, time: any) {
    this.scene = scene
    this.time = time
    this.createFly({
      range: 50,
      height: 300,
      color: color.fly,
      size: 30,
      distance: 400,
    })
  }
  createFly(option: any) {

    // 添加贝塞尔曲线
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-320, 0, 160),
      new THREE.Vector3(-150, 0, -40),
      new THREE.Vector3(-10, 0, -35),
      new THREE.Vector3(40, 0, 40),
      new THREE.Vector3(30, 0, 150),
      new THREE.Vector3(-100, 0, 310),
    ])
    // 计算曲线上的点
    const points = curve.getPoints(option.distance)

    const positions: any = []
    const aPositions: any = []
    points.forEach((point: any, index: number) => {
      positions.push(point.x, point.y, point.z)
      aPositions.push(index)
    })

    // 创建几何体
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('a_position', new THREE.Float32BufferAttribute(aPositions, 1))


    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(option.color),
        },
        u_time: this.time,
        u_range: {
          value: option.range,
        },
        u_size: {
          value: option.size,
        },
        u_total: {
          value: option.distance,
        }
      },
      vertexShader: `
        attribute float a_position;

        uniform float u_time;
        uniform float u_range;
        uniform float u_size;
        uniform float u_total;

        varying float v_opacity;
        void main() {
          float size = u_size;
          float total_number = u_total * mod(u_time, 1.0);
          if (total_number > a_position && total_number < a_position + u_range) {
            // 拖尾效果
            float index = (a_position + u_range - total_number) / u_range;
            size = size * index;

            v_opacity = 1.0;
          } else {
            v_opacity = 0.0;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size / 10.0;
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;
        varying float v_opacity;
        void main() {
          gl_FragColor = vec4(u_color, v_opacity);
        }
      `,
      transparent: true,
    })
    const point = new THREE.Points(geometry, material)
    this.scene.add(point)
  }
}
