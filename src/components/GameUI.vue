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
  <!-- Top UI Bar - Responsive -->
  <div
    class="absolute top-0 left-0 w-full p-2 sm:p-4 bg-black/50 flex justify-between items-center z-10"
  >
    <div class="flex items-center overflow-hidden">
      <!-- Responsive logo -->
      <img :src="dhlLogo" alt="DHL Logo" class="h-6 sm:h-8 mr-2 sm:mr-4 flex-shrink-0" />
      <h1 class="text-lg sm:text-2xl font-bold text-dhl-yellow truncate">
        {{ gameStore.currentRoom.name }}
      </h1>
    </div>

    <div class="flex items-center gap-2 sm:gap-4">
      <!-- DEBUG: Mobile-optimized reset button -->
      <button
        @click="resetGame"
        class="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700"
        title="Reset Game (Debug)"
      >
        <span class="hidden sm:inline">🔄 Reset</span>
        <span class="sm:hidden">🔄</span>
      </button>

      <!-- Mobile-optimized timer -->
      <div
        class="text-2xl sm:text-4xl font-mono font-bold text-dhl-red bg-black px-2 sm:px-4 py-1 rounded"
      >
        {{ formattedTime }}
      </div>
    </div>
  </div>

  <!-- Bottom Hints Panel - Mobile Responsive -->
  <div class="absolute bottom-0 left-0 w-full p-2 sm:p-4 bg-black/70 z-10">
    <div class="max-w-4xl mx-auto text-center">
      <h3 class="text-base sm:text-lg font-bold text-dhl-yellow mb-2">Collected Hints</h3>

      <div
        v-if="roomStore.collectedHints.length === 0"
        class="text-gray-500 italic text-sm sm:text-base"
      >
        No hints collected yet.
      </div>

      <!-- Mobile: Stack hints vertically, Desktop: Horizontal -->
      <div
        class="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 font-mono text-lg sm:text-2xl"
      >
        <div
          v-for="(hint, index) in roomStore.collectedHints"
          :key="index"
          class="bg-gray-900 text-dhl-yellow px-3 sm:px-4 py-1 sm:py-2 rounded border border-dhl-yellow w-full sm:w-auto text-center break-words"
        >
          {{ hint }}
        </div>
      </div>
    </div>
  </div>
</template>
