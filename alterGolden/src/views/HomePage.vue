<template>
    <div class="container py-5">
        <div class="content-card" ref="card">
            <div class="text-center">
                <h1 class="display-4 mb-4 title-sketch">
                    Hey, I'm <span class="alter-text" ref="alterText">alterGolden!</span> 👋
                </h1>

                <p class="lead mb-4" ref="intro">
                    <span class="badge tag-badge mx-1" @click="$router.push('/gamer')">Gamer 🎮</span>
                    <span class="badge tag-badge mx-1" @click="$router.push('/artist')">Artist 🎨</span>
                    <span class="badge tag-badge mx-1" @click="$router.push('/coder')">Coder 🤖</span>
                    <span class="badge tag-badge mx-1" @click="$router.push('/anime')">Anime 📙</span>
                    <span class="badge tag-badge mx-1" @click="$router.push('/music')">JP Music 🎶</span>
                </p>
            </div>

            <h2 class="h3 mt-5 mb-4 text-center">✨ Fun Fact About Me ✨</h2>
            <ul class="list-unstyled facts-container" ref="factsList">
                <li v-for="(fact, index) in facts" :key="index" :ref="el => factsRefs[index] = el"
                    class="fact-item mb-3 p-3">
                    {{ fact }}
                </li>
            </ul>

            <div class="sponsor-section mt-5 p-4" ref="sponsor">
                <h2 class="h4 mb-3 text-center">🚀 Check This Out!</h2>
                <p class="mb-4 text-center">🌟 Meet my Discord Bot: <strong>FumoBOT</strong> 🤖</p>

                <div class="text-center">
                    <button class="btn btn-custom btn-lg" @click="$router.push('/fumo')">
                        See FumoBOT
                    </button>
                </div>
            </div>

            <p class="mt-4 text-center">
                Find me on
                <a href="https://discord.com/users/1128296349566251068" target="_blank" class="custom-link">Discord</a>.
            </p>
        </div>
    </div>
</template>

<script>
import anime from 'animejs'

export default {
    name: 'HomePage',
    data() {
        return {
            facts: [
                "🖌️ Digital artist & pixel doodler",
                "📚 Huge-reader of light novels",
                "🤖 Creator of the FumoBOT",
                "🎧 Has an entire playlist of JP bangers",
                "🎲 RNG master – luck is my strategy"
            ],
            factsRefs: []
        }
    },
    mounted() {
        // Animate main card
        anime({
            targets: this.$refs.card,
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo'
        })

        // Animate alter text
        anime({
            targets: this.$refs.alterText,
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .8)'
        })

        // Animate intro tags
        anime({
            targets: this.$refs.intro.querySelectorAll('.tag-badge'),
            translateY: [20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100, { start: 300 }),
            duration: 600,
            easing: 'easeOutExpo'
        })

        // Animate facts list (alternating left/right)
        anime({
            targets: this.factsRefs.filter(Boolean),
            translateX: (el, i) => (i % 2 === 0 ? [50, 0] : [-50, 0]),
            opacity: [0, 1],
            delay: anime.stagger(150, { start: 500 }),
            duration: 800,
            easing: 'easeOutExpo'
        })


        // Animate sponsor section
        anime({
            targets: this.$refs.sponsor,
            scale: [0.9, 1],
            opacity: [0, 1],
            delay: 1000,
            duration: 800,
            easing: 'easeOutElastic(1, .6)'
        })
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap');

.content-card {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    padding: 3rem;
    border-radius: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.title-sketch,
.title-sketch .alter-text {
    font-family: "Gloria Hallelujah", cursive !important;
}

.alter-text {
    color: #f59e0b;
    font-weight: bold;
}

.tag-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-block;
    margin: 0.25rem;
}

.tag-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.facts-container {
    max-width: 600px;
    margin: 0 auto;
}

.fact-item {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border-radius: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
    padding: 12px 20px;
    margin: 16px 0;
    border: none;
}

.fact-item:nth-child(odd) {
    border-left: 4px solid #f59e0b;
}

.fact-item:nth-child(even) {
    border-right: 4px solid #f59e0b;
}

.fact-item:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sponsor-section {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 2px solid #f59e0b;
    border-radius: 20px;
}

.btn-custom {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 25px;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-custom:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.custom-link {
    color: #667eea !important;
    text-decoration: none !important;
    border-bottom: 2px solid transparent;
    font-weight: 600;
    transition: color 0.2s, border-color 0.2s;
}

.custom-link:hover {
    color: #764ba2 !important;
    border-bottom: 2px solid #764ba2;
    text-decoration: none !important;
}
</style>