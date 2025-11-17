import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { City } from './city'
export const initCity = () => {
  // 获取canvas元素
  const canvas = document.getElementById('webgl') as HTMLCanvasElement;

  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.set(1000, 500, 100);
  scene.add(camera);

  // 添加相机控制器
  const controls = new OrbitControls(camera, canvas);
  // 是否有惯性
  controls.enableDamping = true;
  // 是否可以缩放
  controls.enableZoom = true;
  // 最近和最远距离
  controls.minDistance = 100;
  controls.maxDistance = 2000;

  // 添加灯光
  const light = new THREE.AmbientLight(0xadadad);
  scene.add(light)
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0,0,0)
  scene.add(directionalLight)

 

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // 设置背景色
  renderer.setClearColor(new THREE.Color(0x000000), 1);

  const city = new City(scene, camera, controls)
  const clock = new THREE.Clock();
  const start = () => {
    city.start(clock.getDelta());
    controls.update();
    // 渲染场景
    renderer.render(scene, camera);
    requestAnimationFrame(start);
  }
  start();

  window.addEventListener('resize', () => {
    // 更新相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新相机投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 设置像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.render(scene, camera);
  })
}