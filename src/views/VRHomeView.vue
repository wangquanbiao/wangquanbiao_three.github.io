<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { Room } from '../VR/Room'
import { PositionSprite } from '../VR/PositionSprite'
import { TooltipSprite } from '../VR/TooltipSprite'
const router = useRouter()

const goBack = () => {
  console.log('go back')
  router.go(-1)
}
// show tooltip
const tooltipBox = ref<HTMLElement | null>(null)
const tooltipPosition = ref({
  left: '-100%',
  top: '-100%',
})
const tooltipContent: Ref<Record<string, any>> = ref({
  name: '',
  description: '',
})

function tooltipShow(event: MouseEvent, spriteList: THREE.Sprite[], camera: THREE.Camera) {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  event.preventDefault()
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera)
  // 计算物体和射线的交点
  const intersects = raycaster.intersectObjects(spriteList)
  if (intersects.length > 0) {
    if (intersects[0].object.userData.type === 'information') {
      const element = event.target as HTMLElement
      const elementWidth = element.clientWidth / 2
      const elementHeight = element.clientHeight / 2
      const worldVector = new THREE.Vector3(
        intersects[0].object.position.x,
        intersects[0].object.position.y,
        intersects[0].object.position.z,
      )
      const position = worldVector.project(camera)

      let left = Math.round(
        elementWidth * position.x + elementWidth - tooltipBox.value!.clientWidth / 2,
      )

      let top = Math.round(
        -elementHeight * position.y + elementHeight - tooltipBox.value!.clientHeight / 2,
      )

      tooltipPosition.value = {
        left: `${left}px`,
        top: `${top}px`,
      }

      tooltipContent.value = intersects[0].object.userData
    }
  } else {
    handleTooltipHide(event)
  }
}

function handleTooltipHide(event: MouseEvent) {
  event.preventDefault()
  tooltipPosition.value = {
    left: '-100%',
    top: '-100%',
  }
  tooltipContent.value = {
    name: '',
    description: '',
  }
}
const spriteList: THREE.Sprite[] = [];

const init = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 0.01)

  new Room('客厅', scene, '../../src/assets/images/livingRoom/living')
  new Room('阳台', scene, '../../src/assets/images/balcony/balcony', new THREE.Vector3(0, 0, -10))
  // 阳台位置标识
  const balconySprite = new PositionSprite(scene, camera, '阳台', new THREE.Vector3(0, 0, -4))
  balconySprite.onClick(() => {
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: -10,
      duration: 1,
      ease: 'power2.inOut',
    })
  })
  // 阳台回到客厅位置标识
  const balconyBackSprite = new PositionSprite(scene, camera, '客厅', new THREE.Vector3(1, 0, -6))
  balconyBackSprite.onClick(() => {
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
    })
  })
  const kitchenPosition = new THREE.Vector3(2, 0, 10)
  new Room(
    '厨房',
    scene,
    '../../src/assets/images/kitchen/kitchen',
    kitchenPosition,
    new THREE.Euler(0, -Math.PI / 2, 0),
  )
  // 厨房位置标识
  const kitchenSprite = new PositionSprite(scene, camera, '厨房', new THREE.Vector3(1.5, 0, 4))
  kitchenSprite.onClick(() => {
    gsap.to(camera.position, {
      x: kitchenPosition.x,
      y: kitchenPosition.y,
      z: kitchenPosition.z,
      duration: 1,
      ease: 'power2.inOut',
    })
  })
  // 厨房回到客厅位置标识
  const kitchenBackSprite = new PositionSprite(scene, camera, '客厅', new THREE.Vector3(1, 0, 6))
  kitchenBackSprite.onClick(() => {
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power2.inOut',
    })
  })

  // 获取canvas元素
  const canvas = document.getElementById('vr-home') as HTMLCanvasElement

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)

  const tooltipSprite1 = new TooltipSprite(
    scene,
    new THREE.Vector3(1.5, -0.1, -3),
    '../../src/assets/images/dot.png',
    {
      name: '工艺画',
      description: '十分抽象的工艺画，给人一种很有艺术感的感觉',
      type: 'information',
    },
  )

  const tooltipSprite2 = new TooltipSprite(
    scene,
    new THREE.Vector3(-2.5, -0.1, -3),
    '../../src/assets/images/dot.png',
    {
      name: '木雕艺术品',
      description: '这是一件木雕艺术品，展现了精湛的工艺和设计',
      type: 'information',
    },
  )

  const tooltipSprite3 = new TooltipSprite(
    scene,
    new THREE.Vector3(3, 1, 2),
    '../../src/assets/images/dot.png',
    {
      name: '艺术画',
      description: '这是一件艺术化的作品，展现了独特的设计理念',
      type: 'information',
    },
  )

  spriteList.push(tooltipSprite1.sprite)
  spriteList.push(tooltipSprite2.sprite)
  spriteList.push(tooltipSprite3.sprite)

  canvas.addEventListener('mousemove', (e) => {
    tooltipShow(e, spriteList, camera)
  })
  tooltipBox.value!.addEventListener('mouseleave', handleTooltipHide)
  const render = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()

  // 添加鼠标事件
  let isMouseDown = false
  canvas.addEventListener(
    'mousedown',
    () => {
      isMouseDown = true
    },
    false,
  )
  canvas.addEventListener(
    'mouseup',
    () => {
      isMouseDown = false
    },
    false,
  )
  canvas.addEventListener(
    'mouseout',
    () => {
      isMouseDown = false
    },
    false,
  )
  canvas.addEventListener('mousemove', (event: MouseEvent) => {
    if (isMouseDown) {
      const deltaX = event.movementX * 0.01
      const deltaY = event.movementY * 0.01
      camera.rotation.y += deltaX
      camera.rotation.x += deltaY
      camera.rotation.order = 'YXZ'
    }
  })

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
    <!-- 信息点弹出层 -->
    <div class="tooltip-box" :style="tooltipPosition" ref="tooltipBox">
      <div class="wrapper">
        <div class="name">标题: {{ tooltipContent.name }}</div>
        <div class="description">说明: {{ tooltipContent.description }}</div>
      </div>
    </div>
  </main>
</template>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  width: 100vw;
  height: 100vh;
}
.tooltip-box {
  position: absolute;
  padding: 0px 0px 40px 0px;
  line-height: 30px;
  border-radius: 4px;
  color: #fff;
  z-index: 100;
  cursor: pointer;
  .wrapper {
    position: relative;
    width: 240px;
    max-height: 200px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    .name {
      width: 100%;
      padding: 6px 0;
    }
    .description {
      width: 100%;
      max-height: 100px;
      font-size: 14px;
      overflow-y: auto;
    }
  }
}
</style>
