<template>
  <div class="container py-5">
    <div class="content-card" ref="card">
      <h2 class="display-5 mb-4">🤖 Welcome to my FumoBOT!</h2>

      <p class="lead fumo-description" ref="description">
        FumoBOT is a fun and interactive Discord bot where you can 
        <strong>gamble to collect cool fumo</strong>—kind of like a 
        <em>gacha game</em>! Try your luck, build your collection, and 
        enjoy regular updates and new features!
      </p>

      <div class="fumo-intro-section p-4 rounded mt-4" ref="introSection">
        <h3 class="h4 mb-4">Introduction:</h3>
        <ul class="fumo-list" ref="fumoList">
          <li class="fumo-list-item p-3 mb-2 rounded">
            • How to use the bot? → <code>/starter</code>
          </li>
          <li class="fumo-list-item p-3 mb-2 rounded">
            • How do you use the command? → <code>/tutorial</code>
          </li>
          <li class="fumo-list-item p-3 mb-2 rounded">
            • Problem? Use <code>/report</code> and file it
          </li>
          <li class="fumo-list-item p-3 mb-2 rounded">
            • The bot will always receive updates every month! 🚀
          </li>
          <li class="fumo-list-item p-3 mb-2 rounded">
            • Special thanks to my friends: <strong>Hosuh, Frederick, NormalGuy</strong> for testing it out!
          </li>
          <li class="fumo-list-item p-3 mb-2 rounded">
            • ⚠️ Don't Gamble TOO much guys!!!
          </li>
        </ul>
      </div>

      <div class="d-flex gap-3 justify-content-center mt-4 flex-wrap" ref="buttons">
        <a 
          href="https://discord.com/oauth2/authorize?client_id=1254962096924397569&permissions=182273&integration_type=0&scope=bot"
          target="_blank" 
          class="btn btn-primary btn-lg"
        >
          Invite FumoBOT
        </a>
        <button class="btn btn-secondary btn-lg" @click="$router.push('/')">
          ← Back
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'FumoPage',
  mounted() {
    // Animate card entrance
    anime({
      targets: this.$refs.card,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo'
    })

    // Animate description
    anime({
      targets: this.$refs.description,
      translateX: [-30, 0],
      opacity: [0, 1],
      delay: 300,
      duration: 800,
      easing: 'easeOutExpo'
    })

    // Animate intro section
    anime({
      targets: this.$refs.introSection,
      scale: [0.95, 1],
      opacity: [0, 1],
      delay: 500,
      duration: 800,
      easing: 'easeOutExpo'
    })

    // Animate list items
    anime({
      targets: this.$refs.fumoList.querySelectorAll('.fumo-list-item'),
      translateX: [-30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 700 }),
      duration: 600,
      easing: 'easeOutExpo'
    })

    // Animate buttons
    anime({
      targets: this.$refs.buttons.querySelectorAll('.btn'),
      scale: [0.8, 1],
      opacity: [0, 1],
      delay: anime.stagger(150, { start: 1200 }),
      duration: 600,
      easing: 'easeOutElastic(1, .6)'
    })
  }
}
</script>