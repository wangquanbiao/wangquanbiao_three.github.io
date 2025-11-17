import * as THREE from "three";
import type { Scene, Mesh } from "three";
import { color } from "../config"
export class SurroundLine {
  private scene: Scene;
  private child: any;
  private height: {
    value: number;
  }
  private time: {
    value: number;
  }
  constructor(scene: Scene, child: Mesh, height: any, time: any) {
    this.scene = scene;
    this.child = child;
    this.height = height;
    this.time = time;
    this.createMesh();
    this.createLine();
  }
  computedMesh() {
    this.child.geometry.computeBoundingBox();
    this.child.geometry.computeBoundingSphere();
  }
  createMesh() {
    this.computedMesh()
    // 模型底部显示的颜色
    const { max, min } = this.child.geometry.boundingBox
    // 高度差
    const size = max.z - min.z
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_height: this.height,
        u_up_color: {
          value: new THREE.Color(color.risingColor)
        },
        u_city_color: {
          value: new THREE.Color(color.mesh)
        },
        u_head_color: {
          value: new THREE.Color(color.head)
        },
        u_size: {
          value: size
        }
      },
      vertexShader: `
        varying vec3 v_position;
        void main() {
          v_position = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_position;

        uniform vec3 u_city_color;
        uniform vec3 u_head_color;
        uniform float u_size;
        uniform float u_height;
        uniform vec3 u_up_color;

        void main() {
          vec3 base_color = u_city_color;
          base_color = mix(base_color, u_head_color, v_position.z / u_size);

          // 上升线条的高度
          if (u_height > v_position.z && u_height < v_position.z + 6.0) {
            float alpha = (u_height - v_position.z) / 3.0;
            base_color = mix(u_up_color, base_color, abs(alpha - 1.0));
          }
          gl_FragColor = vec4(base_color, 1.0);
        }
      `
    })
    const mesh = new THREE.Mesh((this.child).geometry, material)

    mesh.position.copy(this.child.position)
    mesh.rotation.copy(this.child.rotation)
    mesh.scale.copy(this.child.scale)
    this.scene.add(mesh)
  }
  createLine() {
    // 获取建筑物的外围
    const geometry = new THREE.EdgesGeometry(this.child.geometry);
    // api 创建线条材质
    // const material = new THREE.LineBasicMaterial({color: color.soundLine});

    // shader 创建线条材质 自定义线条渲染
    const { max, min } = this.child.geometry.boundingBox
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_line_color: {
          value: new THREE.Color(color.soundLine)
        },
        // 不断变化的动态值
        u_time: this.time,
        // 扫描的位置
        u_max: {
          value: max
        },
        u_min: {
          value: min
        },
        // 扫描的颜色
        u_live_color: {
          value: new THREE.Color(color.liveColor)
        }
      },
      vertexShader: `
        uniform float u_time;
        uniform vec3 u_max;
        uniform vec3 u_min;
        uniform vec3 u_live_color;
        uniform vec3 u_line_color;

        varying vec3 v_color;
        void main() {
          float new_time = mod(u_time * 0.1, 1.0);
          // 计算扫描的宽度
          float rangeY = mix(u_min.y, u_max.y, new_time);
          if (rangeY < position.y && position.y - 200.0 < rangeY) {
            // 计算扫描的颜色
            float alpha = 1.0 - sin((position.y - rangeY) / 200.0 * 3.14);
            float r = mix(u_live_color.r, u_line_color.r, alpha);
            float g = mix(u_live_color.g, u_line_color.g, alpha);
            float b = mix(u_live_color.b, u_line_color.b, alpha);
            v_color = vec3(r, g, b);
          } else {
            v_color = u_line_color;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }  
      `,
      fragmentShader: `
        varying vec3 v_color;
        void main() {
          gl_FragColor = vec4(v_color, 1.0);
        }
      `
    })
    const line = new THREE.LineSegments(geometry, material);
    line.position.copy(this.child.position)
    line.rotation.copy(this.child.rotation)
    line.scale.copy(this.child.scale)
    this.scene.add(line);
  }
}