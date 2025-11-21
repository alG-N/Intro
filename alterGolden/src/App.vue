<template>
  <div id="zoom-wrapper">
    <div class="app-wrapper" :class="{ 'gamer-mode': isGamerPage }">
      <!-- Router View with Page Transitions -->
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
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
  }
}
</script>