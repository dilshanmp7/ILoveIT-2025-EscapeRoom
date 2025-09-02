<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import GameView from '@/views/GameView.vue'
import IntroView from '@/views/IntroView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'

const gameStore = useGameStore()
const gameState = computed(() => gameStore.gameState)
</script>

<template>
  <main class="w-full h-full bg-black">
    <IntroView v-if="gameState === 'intro'" />
    <GameView v-else-if="gameState === 'playing'" />
    <LeaderboardView v-else-if="gameState === 'finished'" />
  </main>
</template>
