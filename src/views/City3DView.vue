<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initCity } from '../city/enter'

const router = useRouter()
onMounted(() => {
  initCity()
})
const goBack = () => {
  console.log('go back')
  router.go(-1)
}
</script>

<template>
  <main>
    <canvas id="webgl">浏览器不支持canvas，请切换浏览器重试</canvas>
  </main>
</template>
