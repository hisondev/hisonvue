import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TestPage from '../views/Test001.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/test', name: 'TestPage', component: TestPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router