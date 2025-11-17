import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import City3DView from '../views/City3DView.vue'
import VRHomeView from '../views/VRHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/city',
      name: 'city',
      component: City3DView,
    },
    {
      path: '/vr',
      name: 'vr',
      component: VRHomeView,
    },
  ],
})

export default router
