import * as THREE from 'three'
export class Smoke {
  private scene: THREE.Scene;
  private points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | null;
  private geometry: THREE.BufferGeometry | null;
  private material: THREE.PointsMaterial | null;
  private smokes: {
    size: number,
    opacity: number,
    x: number,
    y: number,
    z: number,
    speed: {
      x: number,
      y: number,
      z: number,
    },
    scale: number,
  }[];
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.smokes = [];
    this.points = null
    this.geometry = null;
    this.material = null;
    this.init();
  }
  init() {
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      size: 50,
      map: new THREE.TextureLoader().load('../../src/assets/smoke.png'),
      transparent: true,
      depthTest: false,
    })
    this.material.onBeforeCompile = function(shader) {
      const vertex1 = `
        attribute float a_opacity;
        attribute float a_size;
        attribute float a_scale;
        varying float v_opacity;
        
        void main() {
          v_opacity = a_opacity;
      `;

      const glPosition = `
        gl_PointSize = a_size * a_scale;
      `

      shader.vertexShader = shader.vertexShader.replace('void main() {', vertex1)
      shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size', glPosition)

      const fragment1 = `
        varying float v_opacity;
      
        void main() {
      `
      const fragment2 = `
        gl_FragColor = vec4(outgoingLight, diffuseColor.a * v_opacity);
      `

      shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment1)
      shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4(outgoingLight, diffuseColor.a);', fragment2)
    }

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }
  createParticle() {
    this.smokes.push({
      size: 50,
      opacity: 1,
      x: 30,
      y: 0,
      z: 270,
      speed: {
        x: Math.random(),
        y: Math.random() + 0.4,
        z: Math.random(),
      },
      scale: 1,
    })
  }
  setAttribute(positionList: number[], sizeList: number[], opacityList: number[], scaleList: number[]) {
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positionList), 3)
    )
    this.geometry.setAttribute(
      'a_size',
      new THREE.BufferAttribute(new Float32Array(sizeList), 1)
    )
    this.geometry.setAttribute(
      'a_opacity',
      new THREE.BufferAttribute(new Float32Array(opacityList), 1)
    )
    this.geometry.setAttribute(
      'a_scale',
      new THREE.BufferAttribute(new Float32Array(scaleList), 1)
    )
  }
  update() {
    const positionList: number[] = []
    const sizeList: number[] = []
    const opacityList: number[] = []
    const scaleList: number[] = []

    this.smokes = this.smokes.filter((smoke) => {
      if (smoke.opacity < 0) {
        return false
      }
      smoke.opacity -= 0.01
      smoke.x = smoke.x + smoke.speed.x
      smoke.y = smoke.y + smoke.speed.y
      smoke.z = smoke.z + smoke.speed.z

      smoke.scale += 0.01;

      positionList.push(smoke.x, smoke.y, smoke.z)
      sizeList.push(smoke.size)
      opacityList.push(smoke.opacity)
      scaleList.push(smoke.scale)
      return true
    })
    this.setAttribute(positionList, sizeList, opacityList, scaleList)
  }
  anmiation() {
    this.createParticle()
    this.update()
  }
}