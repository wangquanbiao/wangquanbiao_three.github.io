<script setup lang="ts">
import { ref ,onMounted} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const routePath = ref('/')
const changePath = () => {
  router.push(routePath.value)
}
onMounted(() => {
  router.replace('./city')
})
</script>

<template>
  <main>
    <!-- <div> 3d 项目集展示</div>
    <el-radio-group v-model="routePath" style="margin-bottom: 20px" @change="changePath">
      <el-radio-button value="/city">city-3d</el-radio-button>
      <el-radio-button value="/vr">vr-home</el-radio-button>
    </el-radio-group> -->
  </main>
</template>
