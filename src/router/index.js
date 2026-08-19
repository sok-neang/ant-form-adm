import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/user/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // User 
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Admin
    

   
  ],
})

export default router
