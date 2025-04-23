import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import GridTestPage from '../views/GridTest.vue'
import NoteTestPage from '../views/NoteTest.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/gridTest', name: 'gridTest', component: GridTestPage },
  { path: '/noteTest', name: 'noteTest', component: NoteTestPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
