<template>
  <div class="container py-5">
    <div class="content-card" ref="card">
      <h2 class="display-5 mb-4" ref="title">🤖 Coding Corner</h2>
      
      <p class="lead mb-4" ref="description">
        I'm a passionate backend developer with a strong focus on JavaScript and related technologies.
        I also enjoy crafting clean and responsive interfaces using HTML and CSS.
        Whether it's building bots, writing fun scripts, or exploring new languages, 
        I'm always coding something interesting!
      </p>

      <div class="fumo-bot-ad p-4 rounded mt-4" ref="fumoAd">
        <h3 class="h4 mb-3">🎲 FumoBOT – Your Fumo Collector</h3>
        <p class="mb-4">
          Dive into a world of luck, strategy, and chaos with FumoBOT – an interactive 
          Discord bot where you collect rare fumo, roll for surprises, and enjoy monthly 
          updates. Built for fun, built to grow!
        </p>
        <div class="text-center">
          <button class="btn btn-custom btn-lg" @click="$router.push('/fumo')">
            See FumoBOT NOW!
          </button>
        </div>
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
  name: 'CoderPage',
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
      opacity: [0, 1],
      translateX: [-100, 0],
      delay: 300,
      duration: 800,
      easing: 'easeOutExpo'
    })

    anime({
      targets: this.$refs.description,
      opacity: [0, 1],
      translateY: [30, 0],
      delay: 500,
      duration: 800,
      easing: 'easeOutExpo'
    })

    anime({
      targets: this.$refs.fumoAd,
      scale: [0.9, 1],
      opacity: [0, 1],
      delay: 700,
      duration: 1000,
      easing: 'easeOutElastic(1, .5)'
    })
  }
}
</script>