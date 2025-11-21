import { createRouter, createWebHashHistory } from 'vue-router' // CHANGE THIS
import HomePage from '../views/HomePage.vue'
import FumoPage from '../views/FumoPage.vue'
import GamerPage from '../views/GamerPage.vue'
import ArtistPage from '../views/ArtistPage.vue'
import CoderPage from '../views/CoderPage.vue'
import AnimePage from '../views/AnimePage.vue'
import MusicPage from '../views/MusicPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/fumo',
    name: 'fumo',
    component: FumoPage
  },
  {
    path: '/gamer',
    name: 'gamer',
    component: GamerPage
  },
  {
    path: '/artist',
    name: 'artist',
    component: ArtistPage
  },
  {
    path: '/coder',
    name: 'coder',
    component: CoderPage
  },
  {
    path: '/anime',
    name: 'anime',
    component: AnimePage
  },
  {
    path: '/music',
    name: 'music',
    component: MusicPage
  }
]

const router = createRouter({
  history: createWebHashHistory('/Intro/'), // CHANGE THIS - add base path
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router