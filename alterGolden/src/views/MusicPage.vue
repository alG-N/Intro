<template>
  <div class="container py-5">
    <div class="content-card" ref="card">
      <h2 class="display-5 mb-4" ref="title">🎶 Just cool remix - Japan type Beats</h2>
      
      <p class="lead mb-4" ref="description">
        From opening themes to deep cuts, if it's Japanese music, it's probably on my playlist.
      </p>

      <div class="music-placeholder mt-5 p-5 text-center rounded" ref="placeholder">
        <div class="display-1 mb-3">🎵</div>
        <p class="text-muted">Music collection showcase coming soon...</p>
      </div>

      <button class="btn btn-secondary btn-lg mt-4" @click="$router.push('/')">
        ← Back
      </button>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'MusicPage',
  mounted() {
    anime({
      targets: this.$refs.card,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo'
    })

    anime({
      targets: this.$refs.title,
      translateY: [-30, 0],
      opacity: [0, 1],
      rotate: [-3, 0],
      delay: 300,
      duration: 1000,
      easing: 'easeOutElastic(1, .6)'
    })

    anime({
      targets: this.$refs.description,
      opacity: [0, 1],
      translateX: [-30, 0],
      delay: 500,
      duration: 800,
      easing: 'easeOutExpo'
    })

    anime({
      targets: this.$refs.placeholder,
      scale: [0.8, 1],
      opacity: [0, 1],
      delay: 700,
      duration: 1000,
      easing: 'easeOutElastic(1, .5)'
    })
  }
}
</script>