<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRoomStore } from '@/stores/roomStore'
// NEW: Import the local logo images
import dhlLogo from '@/assets/dhl_logo2.png'
import iLoveItLogo from '@/assets/IloveIT.png'

const gameStore = useGameStore()
const roomStore = useRoomStore()

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
  <!-- Top UI Bar - Responsive with better mobile spacing -->
  <div
    class="absolute top-0 left-0 w-full p-2 sm:p-4 bg-black/90 border-b border-gray-600 flex justify-between items-center z-20"
  >
    <!-- Left side: Logos (mobile and desktop) -->
    <div class="flex items-center overflow-hidden">
      <!-- Combined logos -->
      <div class="flex items-center gap-1 sm:gap-2 mr-2 sm:mr-4 flex-shrink-0">
        <img :src="dhlLogo" alt="DHL Logo" class="h-6 sm:h-8" />
        <img :src="iLoveItLogo" alt="I Love IT" class="h-5 sm:h-7" />
      </div>
      <!-- Room name for mobile only -->
      <h1 class="text-lg font-bold text-dhl-yellow truncate sm:hidden">
        {{ gameStore.currentRoom.name }}
      </h1>
    </div>

    <!-- Center: Room name for desktop only -->
    <div class="hidden sm:flex absolute left-1/2 transform -translate-x-1/2">
      <h1
        class="text-3xl lg:text-4xl xl:text-5xl font-bold text-dhl-yellow text-center whitespace-nowrap"
      >
        {{ gameStore.currentRoom.name }}
      </h1>
    </div>

    <!-- Right side: Timer -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Mobile-optimized timer -->
      <div
        class="text-2xl sm:text-4xl font-mono font-bold text-dhl-red bg-black px-2 sm:px-4 py-1 rounded"
      >
        {{ formattedTime }}
      </div>
    </div>
  </div>

  <!-- Bottom Hints Panel - Progressive horizontal display -->
  <div class="absolute bottom-0 left-0 w-full p-2 sm:p-4 bg-black/95 border-t border-gray-600 z-20">
    <div class="max-w-4xl mx-auto text-center">
      <h3 class="text-sm sm:text-lg font-bold text-dhl-yellow mb-2">Security Override Hints</h3>

      <div
        v-if="roomStore.collectedHints.length === 0"
        class="text-gray-400 italic text-xs sm:text-base"
      >
        Solve puzzles to collect hints for the final code
      </div>

      <!-- Progressive horizontal hints display -->
      <div
        class="flex flex-row justify-center items-center gap-2 sm:gap-4 font-mono text-sm sm:text-xl"
      >
        <!-- Hint 1 Slot -->
        <div class="flex flex-col items-center">
          <div class="text-xs text-gray-400 mb-1">Hint 1</div>
          <div
            v-if="roomStore.collectedHints[0]"
            class="bg-dhl-yellow text-black px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-dhl-yellow font-bold text-center min-w-[100px] sm:min-w-[150px] animate-pulse"
          >
            {{ roomStore.collectedHints[0] }}
          </div>
          <div
            v-else
            class="bg-gray-800 text-gray-500 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-600 text-center min-w-[100px] sm:min-w-[150px]"
          >
            ???
          </div>
        </div>

        <!-- Hint 2 Slot -->
        <div class="flex flex-col items-center">
          <div class="text-xs text-gray-400 mb-1">Hint 2</div>
          <div
            v-if="roomStore.collectedHints[1]"
            class="bg-dhl-yellow text-black px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-dhl-yellow font-bold text-center min-w-[100px] sm:min-w-[150px] animate-pulse"
          >
            {{ roomStore.collectedHints[1] }}
          </div>
          <div
            v-else
            class="bg-gray-800 text-gray-500 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-600 text-center min-w-[100px] sm:min-w-[150px]"
          >
            ???
          </div>
        </div>

        <!-- Hint 3 Slot -->
        <div class="flex flex-col items-center">
          <div class="text-xs text-gray-400 mb-1">Hint 3</div>
          <div
            v-if="roomStore.collectedHints[2]"
            class="bg-dhl-yellow text-black px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-dhl-yellow font-bold text-center min-w-[100px] sm:min-w-[150px] animate-pulse"
          >
            {{ roomStore.collectedHints[2] }}
          </div>
          <div
            v-else
            class="bg-gray-800 text-gray-500 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-600 text-center min-w-[100px] sm:min-w-[150px]"
          >
            ???
          </div>
        </div>
      </div>

      <!-- Progress indicator -->
      <div class="mt-2 text-xs sm:text-sm text-gray-400">
        {{ roomStore.collectedHints.length }}/3 hints collected
      </div>
    </div>
  </div>
</template>
