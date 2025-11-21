<template>
  <div class="container py-5">
    <div class="content-card" ref="card">
      <h2 class="display-5 mb-4" ref="title">📙 Anime & Manga Life</h2>
      
      <div class="anime-intro p-4 rounded mb-4" ref="intro">
        <p class="lead mb-0">
          Whether it's deep stories or chaotic fun, anime and manga are my happy place.
        </p>
      </div>

      <div class="anime-scroll-container mb-4" ref="animeGrid">
        <div class="d-flex gap-4 pb-3" style="overflow-x: auto;">
          <div 
            v-for="(anime, index) in animeList" 
            :key="index"
            :ref="el => animeRefs[index] = el"
            class="anime-card"
          >
            <div class="character-float">
              <img :src="anime.character" :alt="anime.characterName">
            </div>
            <div class="anime-banner" :style="{ backgroundImage: `url(${anime.banner})` }">
              <div class="anime-info">
                <h3 class="h5 mb-2">{{ anime.title }}</h3>
                <p class="mb-1"><strong>Status:</strong> {{ anime.status }}</p>
                <p class="mb-0"><strong>Genres:</strong> {{ anime.genres }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary btn-lg" @click="$router.push('/')">
        ← Back
      </button>
    </div>
  </div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'AnimePage',
  data() {
    return {
      animeList: [
        {
          title: 'Jujutsu Kaisen',
          status: 'Finished',
          genres: 'Action, Supernatural',
          banner: '/Source/jjk.jpg',
          character: '/Source/gojo.png',
          characterName: 'Gojo Satoru'
        },
        {
          title: 'The Apothecary Diaries',
          status: 'Watching',
          genres: 'Mystery, Drama, Historical',
          banner: '/Source/apothecary.jpg',
          character: '/Source/maomao.png',
          characterName: 'Xiaomao'
        },
        {
          title: 'Solo Leveling',
          status: 'Finished',
          genres: 'Action, Adventure, Fantasy',
          banner: '/Source/sololeveling.jpg',
          character: '/Source/sjw.png',
          characterName: 'Sung Jinwoo'
        }
      ],
      animeRefs: []
    }
  },
  mounted() {
    // Animate card
    anime({
      targets: this.$refs.card,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo'
    })

    // Animate title
    anime({
      targets: this.$refs.title,
      translateX: [-50, 0],
      opacity: [0, 1],
      delay: 300,
      duration: 800,
      easing: 'easeOutExpo'
    })

    // Animate intro
    anime({
      targets: this.$refs.intro,
      scale: [0.95, 1],
      opacity: [0, 1],
      delay: 500,
      duration: 800,
      easing: 'easeOutExpo'
    })

    // Animate anime cards
    anime({
      targets: this.animeRefs.filter(Boolean),
      translateX: [100, 0],
      opacity: [0, 1],
      delay: anime.stagger(200, { start: 700 }),
      duration: 1000,
      easing: 'easeOutExpo'
    })

    // Add horizontal scroll with mouse wheel
    const container = this.$refs.animeGrid.querySelector('.d-flex')
    if (container) {
      container.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault()
          container.scrollLeft += e.deltaY
        }
      }, { passive: false })
    }
  }
}
</script>