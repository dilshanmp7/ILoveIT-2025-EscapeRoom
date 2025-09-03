<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import GameView from '@/views/GameView.vue'
import IntroView from '@/views/IntroView.vue'
import ResultsView from '@/views/ResultsView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'

const route = useRoute()
const gameStore = useGameStore()
const gameState = computed(() => gameStore.gameState)

// Check if we're on a route that should bypass the game state system
const isSpecialRoute = computed(() => {
  return (
    route.path.startsWith('/admin') ||
    route.path === '/about' ||
    route.path === '/results' ||
    route.path === '/leaderboard'
  )
})
</script>

<template>
  <main class="w-full h-full bg-black">
    <!-- Show router view for special routes (admin, about, results, leaderboard) -->
    <router-view v-if="isSpecialRoute" />

    <!-- Show game views based on game state for main game -->
    <template v-else>
      <IntroView v-if="gameState === 'intro'" />
      <GameView v-else-if="gameState === 'playing'" />
      <ResultsView v-else-if="gameState === 'finished'" />
    </template>
  </main>
</template>
