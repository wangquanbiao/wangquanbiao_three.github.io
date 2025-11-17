<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from "gsap";
import * as dat from "dat.gui";
const router = useRouter()

const goBack = () => {
  console.log('go back')
  router.go(-1)
}

const init = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 0.01)

  // const geometry = new THREE.BoxGeometry(10, 10, 10);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);
  const createBox = (arr: string[], position: THREE.Vector3, rotation: THREE.Euler) => {
    const materials: THREE.MeshBasicMaterial[] = []
    arr.forEach(item => {
      const texture = new THREE.TextureLoader().load(item);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      materials.push(material);
    })
   
    // 创建几何体
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    // 创建网格
    const box = new THREE.Mesh(geometry, materials);
    box.geometry.scale(1, 1, -1);
    box.position.copy(position);
    box.rotation.copy(rotation);
    scene.add(box);
    return box
  }

  const livingRooms = [
    '../../src/assets/images/livingRoom/living_r.jpg',
    '../../src/assets/images/livingRoom/living_l.jpg',
    '../../src/assets/images/livingRoom/living_u.jpg',
    '../../src/assets/images/livingRoom/living_d.jpg',
    '../../src/assets/images/livingRoom/living_f.jpg',
    '../../src/assets/images/livingRoom/living_b.jpg',
  ]
  const box = createBox(livingRooms, new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0))
  const balconys = [
    '../../src/assets/images/balcony/balcony_r.jpg',
    '../../src/assets/images/balcony/balcony_l.jpg',
    '../../src/assets/images/balcony/balcony_u.jpg',
    '../../src/assets/images/balcony/balcony_d.jpg',
    '../../src/assets/images/balcony/balcony_f.jpg',
    '../../src/assets/images/balcony/balcony_b.jpg',
  ]
  createBox(balconys, new THREE.Vector3(0, 0, -10), new THREE.Euler(0, 0, 0))
  const createSphere = () => {
    const sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
    sphereGeometry.scale(1, 1, -1);
    const texture = new THREE.TextureLoader().load('../../src/assets/images/scene.jpeg');
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
  }
  // createSphere()
  const createBalcony = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.fillStyle = 'rgba(100,100,100,.7)';
    context.fillRect(0, 256, canvas.width, canvas.height / 2);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 200px Arial";
    context.fillStyle = "white";
    context.fillText("阳台", canvas.width / 2, canvas.height / 2);
    const balconySpriteTexture = new THREE.CanvasTexture(canvas);
    const balconySpriteMaterial = new THREE.SpriteMaterial({
      map: balconySpriteTexture,
      transparent: true,
    });
    const balconySprite = new THREE.Sprite(balconySpriteMaterial);
    const balconySpritePosition = new THREE.Vector3(0, 0, -4);
    balconySprite.position.copy(balconySpritePosition);
    scene.add(balconySprite);
    return balconySprite;
  }
  const balconySprite = createBalcony()


  // 获取canvas元素
  const canvas = document.getElementById('vr-home') as HTMLCanvasElement

  // const controls = new OrbitControls(camera, canvas)
  // controls.enableDamping = true
  // controls.enableZoom = true
  // 坐标辅助器
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)

  const render = () => {
    renderer.render(scene, camera)
    // controls.update()
    requestAnimationFrame(render)
  }

  const gui = new dat.GUI()
  const boxFolder = gui.addFolder('立方体属性');
  boxFolder.add(box.position, "x").name("移动x轴").min(-5).max(5).step(0.1);
  boxFolder.add(box.position, "y").name("移动y轴").min(-5).max(5).step(0.1);
  boxFolder.add(box.position, "z").name("移动z轴").min(-5).max(5).step(0.1);
  boxFolder.add(box.rotation, "x").name("旋转x轴").min(-5).max(5).step(0.1);
  boxFolder.add(box.rotation, "y").name("旋转y轴").min(-5).max(5).step(0.1);
  boxFolder.add(box.rotation, "z").name("旋转z轴").min(-5).max(5).step(0.1);
  boxFolder.addColor({ color: 0x00ff00 }, "color").name("修改颜色").onChange((color) => {
    box.material.color = new THREE.Color(color);
  })
  const params = {
    visible: true,
    moveAnimation: () => {
      gsap.to(box.position, { x: 5, duration: 2 });
    },
    cameraAnimation: () => {
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 0,
        z: -10,
      });
    },
  };
  boxFolder
    .add(params, "visible")
    .name("是否可见")
    .onChange((e) => {
      box.visible = e;
    });
  boxFolder.add(params, "moveAnimation").name("移动动画");
  boxFolder.open();

  const cameraFolder = gui.addFolder("相机属性");
  cameraFolder
    .add(camera.position, "x")
    .name("相机x轴")
    .min(-30)
    .max(30)
    .step(0.1);
  cameraFolder
    .add(camera.position, "y")
    .name("相机y轴")
    .min(-30)
    .max(30)
    .step(0.1);
  cameraFolder
    .add(camera.position, "z")
    .name("相机z轴")
    .min(-30)
    .max(30)
    .step(0.1);
  cameraFolder
    .add(camera.rotation, "x")
    .name("相机旋转x轴")
    .min(-5)
    .max(5)
    .step(0.1);
  cameraFolder
    .add(camera.rotation, "y")
    .name("相机旋转y轴")
    .min(-5)
    .max(5)
    .step(0.1);
  cameraFolder
    .add(camera.rotation, "z")
    .name("相机旋转z轴")
    .min(-5)
    .max(5)
    .step(0.1);

  cameraFolder.add(params, "cameraAnimation").name("相机移动位置");
  cameraFolder.open();
  
  render()

  // 添加鼠标事件
  let isMouseDown = false
  canvas.addEventListener("mousedown", () => {
    isMouseDown = true
  }, false)
  canvas.addEventListener("mouseup", () => {
    isMouseDown = false 
  }, false)
  canvas.addEventListener("mouseout", () => {
    isMouseDown = false
  }, false)
  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    if (isMouseDown) {
      const deltaX = event.movementX * 0.01
      const deltaY = event.movementY * 0.01
      camera.rotation.y += deltaX
      camera.rotation.x += deltaY
      camera.rotation.order = "YXZ"
    }
  })


  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // 添加点击事件
  window.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera);
    // 计算物体和射线的交点
    const intersects = raycaster.intersectObjects([balconySprite!]);
    if (intersects.length > 0) { 
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 0,
        z: -10,
      });
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <main>
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3"> VR看房 </span>
      </template>
    </el-page-header>
    <canvas id="vr-home">浏览器不支持canvas，请切换浏览器重试</canvas>
  </main>
</template>
