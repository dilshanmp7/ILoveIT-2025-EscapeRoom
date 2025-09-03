<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRoomStore } from '@/stores/roomStore'
// NEW: Import the local logo image
import dhlLogo from '@/assets/dhl_logo2.png'

const gameStore = useGameStore()
const roomStore = useRoomStore()

// DEBUG: Function to reset everything (remove in production)
function resetGame() {
  localStorage.clear()
  location.reload()
}

const formattedTime = computed(() => {
  // Only show timer if game is actually playing
  if (gameStore.gameState !== 'playing' || gameStore.elapsedTime === 0) {
    return '60:00'
  }

  const totalSeconds = Math.max(0, 60 * 60 - gameStore.elapsedTime)
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})
</script>
<template>
  <div class="absolute top-0 left-0 w-full p-4 bg-black/50 flex justify-between items-center z-10">
    <div class="flex items-center">
      <!-- CHANGED: The img src now points to the imported local logo -->
      <img :src="dhlLogo" alt="DHL Logo" class="h-8 mr-4" />
      <h1 class="text-2xl font-bold text-dhl-yellow">{{ gameStore.currentRoom.name }}</h1>
    </div>
    <div class="flex items-center gap-4">
      <!-- DEBUG: Reset button (remove in production) -->
      <button
        @click="resetGame"
        class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        title="Reset Game (Debug)"
      >
        🔄 Reset
      </button>
      <div class="text-4xl font-mono font-bold text-dhl-red bg-black px-4 py-1 rounded">
        {{ formattedTime }}
      </div>
    </div>
  </div>

  <div class="absolute bottom-0 left-0 w-full p-4 bg-black/70 z-10">
    <div class="max-w-4xl mx-auto text-center">
      <h3 class="text-lg font-bold text-dhl-yellow mb-2">Collected Hints</h3>
      <div v-if="roomStore.collectedHints.length === 0" class="text-gray-500 italic">
        No hints collected yet.
      </div>
      <div class="flex justify-center items-center gap-4 font-mono text-2xl">
        <div
          v-for="(hint, index) in roomStore.collectedHints"
          :key="index"
          class="bg-gray-900 text-dhl-yellow px-4 py-2 rounded border border-dhl-yellow"
        >
          {{ hint }}
        </div>
      </div>
    </div>
  </div>
</template>
