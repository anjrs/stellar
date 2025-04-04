import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Produits from '../views/Produits.vue'
import Admin from '../views/Admin.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/produits', name: 'Produits', component: Produits },
  { path: '/admin', name: 'Admin', component: Admin },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
