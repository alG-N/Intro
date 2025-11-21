<template>
  <div class="container py-5">
    <div class="content-card" ref="card">
      <h2 class="display-5 mb-4" ref="title">🎨 Art Zone</h2>
      <p class="lead" ref="description">
        From pixel doodles to full digital pieces – I just love creating stuff visually.
      </p>
      
      <div class="art-placeholder mt-5 p-5 text-center rounded" ref="placeholder">
        <div class="display-1 mb-3">🖌️</div>
        <p class="text-muted">Art gallery coming soon...</p>
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
  name: 'ArtistPage',
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
      translateX: [-50, 0],
      opacity: [0, 1],
      rotate: [-5, 0],
      delay: 300,
      duration: 800,
      easing: 'easeOutExpo'
    })

    anime({
      targets: this.$refs.description,
      translateY: [20, 0],
      opacity: [0, 1],
      delay: 500,
      duration: 800,
      easing: 'easeOutExpo'
    })

    anime({
      targets: this.$refs.placeholder,
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: 700,
      duration: 800,
      easing: 'easeOutElastic(1, .6)'
    })
  }
}
</script>