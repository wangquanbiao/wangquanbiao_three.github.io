import { loadFBx } from "@/utils";
import * as THREE from "three";
import type { Scene } from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { SurroundLine } from "../effect/surroundLine"
import { Background } from "../effect/background";
import { Radar } from "../effect/radar";
import { Wall } from "../effect/wall";
import { Circle } from "../effect/circle";
import { Ball } from "../effect/ball";
import { Cone } from "../effect/cone";
import { Fly } from "../effect/fly";
import { Road } from "../effect/road";
import { CreateFont } from "../effect/font";
import { Snow } from "../effect/snow";
import { Rain } from "../effect/rain";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Smoke } from "../effect/smoke";
export class City {
  private scene: Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private tweenPostion: TWEEN.Tween<THREE.Vector3> | null;
  private tweenRotation: TWEEN.Tween<THREE.Euler> | null;
  private height: {
    value: number;
  }
  private time: {
    value: number;
  }
  private top: {
    value: number;
  }
  private flag: boolean;
  private effect: {
    [key: string]: any;
  }
  constructor(scene: Scene, camera: THREE.PerspectiveCamera, controls: OrbitControls) {
    this.scene = scene;
    this.camera = camera
    this.controls = controls
    this.tweenPostion = null;
    this.tweenRotation = null;
    this.height = {
      value: 5,
    }
    this.top = {
      value: 5,
    }
    this.flag = false;
    this.time = {
      value: 0,
    }
    this.effect = {}
    this.loadCity();
  }
  loadCity() {
    // 加载城市模型
    loadFBx("/model/beijing.fbx").then(object => {
      // console.log(object)
      // this.scene.add(object)
      object.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          new SurroundLine(this.scene, child as THREE.Mesh, this.height, this.time)
        }
      })
      this.initEffect();
    })
  }
  initEffect() {
    new Background(this.scene)
    new Radar(this.scene, this.time)
    new Wall(this.scene, this.time)
    new Circle(this.scene, this.time)
    new Ball(this.scene, this.time)
    new Cone(this.scene, this.height, this.top)
    new Fly(this.scene, this.time)
    new Road(this.scene, this.time)
    new CreateFont(this.scene)
    // this.effect.snow = new Snow(this.scene)
    // this.effect.rain = new Rain(this.scene)
    
    this.effect.smoke = new Smoke(this.scene)
    this.addClick()
    this.addWheel()
  }
  addWheel() {
    const body = document.body;
    body.onmousewheel = (event) => {
      const value = 30;

      // 鼠标当前的坐标信息
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      // 把浏览器坐标转换到three坐标
      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(this.camera);
      // 把three坐标转换到世界坐标
      vector.sub(this.camera.position).normalize();
      if (event.wheelDelta > 0) {
        // 放大
        this.camera.position.addScaledVector(vector, value);
        this.controls.target.addScaledVector(vector, value);
      } else {
        // 缩小
        this.camera.position.addScaledVector(vector, -value);
        this.controls.target.addScaledVector(vector, -value);
      }
    }
  }
  addClick() {
    let flag = true;
    document.onmousedown = () => {
      flag = true;
      document.onmousemove = (event) => {
        flag = false;
      }
    }
    document.onmouseup = (event) => {
      if (flag) {
        this.EventClick(event)
      }
      document.onmousemove = null;
    }
  }
  EventClick(event: MouseEvent) {
      // 获取到浏览器坐标
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      // 把浏览器坐标转换到three坐标
      const vector = new THREE.Vector3(x, y, 0.5);
      // 把three坐标转换到世界坐标
      const worldVector = vector.unproject(this.camera);

      // 序列化
      const ray = worldVector.sub(this.camera.position).normalize();

      // 射线
      const raycaster = new THREE.Raycaster(this.camera.position, ray);

      // 检测射线是否与物体相交
      const intersects = raycaster.intersectObjects(this.scene.children, true);
      
      let point3d = null;
      if (intersects.length > 0) {
        point3d = intersects[0];
      }
      if (point3d) {
        console.log(point3d,  this.camera); 
        // 点击到物体 修改观察点
        const time = 1000;
        const proportion = 3;
        this.tweenPostion = new TWEEN.Tween(this.camera.position).to({
          x: point3d.point.x * proportion,
          y: point3d.point.y * proportion,
          z: point3d.point.z * proportion
        }, time).start();
        this.tweenRotation = new TWEEN.Tween(this.camera.rotation).to({
          x: this.camera.rotation.x,
          y: this.camera.rotation.y,
          z: this.camera.rotation.z
        }, time).start()
      }
  }

  start(getDelta: number){
    for(let key in this.effect) {
      this.effect[key] && this.effect[key].anmiation();
    }
    if (this.tweenPostion && this.tweenRotation) {
      this.tweenPostion.update();
      this.tweenRotation.update();
    }
    this.time.value += getDelta;
    this.height.value += 0.4;
    if (this.height.value > 160) {
      this.height.value = 5;
    }
    if (this.top.value > 15 || this.top.value < 0) {
      this.flag = !this.flag;
    }
    this.top.value += this.flag ? 0.4 : -0.4;
  }
}