<template>
  <div class="app-wrapper" :class="{ 'gamer-mode': isGamerPage }">
    <!-- Decorative Characters - Hidden on Gamer Page -->
    <div v-if="!isGamerPage" class="alter-container" ref="alterGolden">
      <img src="/Source/alterGolden.png" alt="alterGolden">
      <div class="alter-caption">
        <div class="caption-text">This is alterGolden or me :D</div>
        <img src="/Source/Arrow-Down-PNG-File.png" class="arrow-img" alt="arrow">
      </div>
    </div>
    <img v-if="!isGamerPage" src="/Source/alterGolden2.png" class="alter-golden-2" ref="alterGolden2">

    <!-- Router View with Page Transitions -->
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.js'

export default {
  name: 'App',
  data() {
    return {
      isGamerPage: false
    }
  },
  watch: {
    '$route'(to) {
      this.isGamerPage = to.name === 'gamer'
    }
  },
  mounted() {
    // Check initial route
    this.isGamerPage = this.$route.name === 'gamer'
    
    // Parallax effect for decorative images
    document.addEventListener('mousemove', (e) => {
      if (this.isGamerPage) return // Skip parallax on gamer page
      
      const moveX = (e.clientX / window.innerWidth - 0.5) * 20
      const moveY = (e.clientY / window.innerHeight - 0.5) * 20
      
      if (this.$refs.alterGolden) {
        anime({
          targets: this.$refs.alterGolden,
          translateX: moveX,
          translateY: moveY,
          duration: 1000,
          easing: 'easeOutElastic(1, .6)'
        })
      }
      
      if (this.$refs.alterGolden2) {
        anime({
          targets: this.$refs.alterGolden2,
          translateX: -moveX,
          translateY: moveY,
          duration: 1000,
          easing: 'easeOutElastic(1, .6)'
        })
      }
    })

    // Initial slide-in animation (only if not gamer page)
    if (!this.isGamerPage) {
      anime({
        targets: this.$refs.alterGolden,
        translateX: ['-100%', 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
      })

      anime({
        targets: this.$refs.alterGolden2,
        translateX: ['100%', 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
      })
    }
  }
}
</script>