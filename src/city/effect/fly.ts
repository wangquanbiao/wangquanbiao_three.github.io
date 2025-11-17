import * as THREE from 'three'
import { color } from '../config'
export class Fly {
  private scene: THREE.Scene
  private time: {
    value: number
  }
  constructor(scene: THREE.Scene, time: any) {
    this.scene = scene
    this.time = time
    this.createFly({
      // 起点
      start: {
        x: 300,
        y: 0,
        z: -200,
      },
      // 终点
      target: {
        x: -500,
        y: 0,
        z: -240,
      },
      range: 150,
      height: 300,
      color: color.fly,
      size: 30
    })
  }
  createFly(option: any) {
    // 起始点
    const start = new THREE.Vector3(option.start.x, option.start.y, option.start.z)
    // 终点
    const target = new THREE.Vector3(option.target.x, option.target.y, option.target.z)
    // 中心点
    const center = new THREE.Vector3().addVectors(start, target).divideScalar(2)
    // 设置中心点高度
    center.y += option.height
    // 计算起点到终点的距离
    const distance = parseInt(start.distanceTo(target).toFixed(0))

    // 添加贝塞尔曲线
    const curve = new THREE.QuadraticBezierCurve3(start, center, target)
    // 计算曲线上的点
    const points = curve.getPoints(distance)

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
          value: distance,
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
