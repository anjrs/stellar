import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Produits from '../views/Produits.vue'
import Admin from '../views/Admin.vue'
import panier from '../views/Panier.vue'  
import Inscription from '../views/Inscription.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/produits', name: 'Produits', component: Produits },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/panier', name: 'Panier', component: panier },
  { path: '/inscription', name: 'Inscriptrion', component: Inscription },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
