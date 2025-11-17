import * as THREE from 'three';
import { color } from '../config'
export class Radar {
  private scene: THREE.Scene;
  private time: {
    value: number;
  };
  constructor(scene: THREE.Scene, time: any) {
    this.scene = scene;
    this.time = time;
    this.init();
  }
  init() {
    const radius = 50; // 圆环半径
    // 创建圆环几何体
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 1, 1);

    // 创建材质
    const metarial = new THREE.ShaderMaterial({
      uniforms: {
        u_time: this.time,
        u_color: {
          value: new THREE.Color(color.radarColor),
        },
        u_radius: {
          value: radius,
        },
      },
      vertexShader: `
        varying vec2 v_position;
        void main() {
          v_position = vec2(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec2 v_position;

        uniform float u_time;
        uniform vec3 u_color;
        uniform float u_radius;

        void main() {
          float angle = atan(v_position.x, v_position.y);
          float new_angle = mod(angle + u_time, 3.1415926 * 2.0);

          // 计算距离
          float dis = distance(vec2(0.0, 0.0), v_position);
          // 外层圆环的宽度
          float borderWidth = 2.0;
          float f_opacity = 0.0;
          // 在圆环上
          if (dis > u_radius - borderWidth) {
            f_opacity = 1.0;
          } else if (dis < u_radius - borderWidth) {
            f_opacity = 1.0 - new_angle;
          }
          // 在雷达之外
          if (dis > u_radius) {
            f_opacity = 0.0;
          }

          gl_FragColor = vec4(u_color, f_opacity);
        }
      
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
    })
    const mesh = new THREE.Mesh(geometry, metarial);
    mesh.position.set(300, 0, 0);
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);
  }
}