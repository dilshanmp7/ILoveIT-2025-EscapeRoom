<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import GameView from '@/views/GameView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import IntroView from '@/views/IntroView.vue'
import ResultsView from '@/views/ResultsView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'

const route = useRoute()
const gameStore = useGameStore()
const gameState = computed(() => gameStore.gameState)

const isSpecialRoute = computed(() => {
  // If a game is active, it should always take priority over special routes.
  if (gameStore.gameState === 'playing') {
    return false
  }
  // Otherwise, check for special routes.
  return (
    route.path.startsWith('/admin') ||
    route.path === '/about' ||
    route.path === '/results' ||
    route.path === '/leaderboard' ||
    route.path === '/'
  )
})
</script>

<template>
  <main class="w-full h-full">
    <router-view v-if="isSpecialRoute" />

    <template v-else>
      <IntroView v-if="gameState === 'intro'" />
      <GameView v-else-if="gameState === 'playing'" />
      <ResultsView v-else-if="gameState === 'finished'" />
    </template>
  </main>
</template>
