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
    return '45:00'
  }

  const totalSeconds = Math.max(0, 45 * 60 - gameStore.elapsedTime)
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})
</script>
<template>
  <!-- Top UI Bar - Ultra-compact design for maximum middle space -->
  <div
    class="absolute top-0 left-0 w-full px-1 py-1 mobile:px-2 mobile:py-1 sm:px-2 sm:py-1 laptop:px-3 laptop:py-1 large:px-3 large:py-1 bg-black/90 border-b border-gray-600 flex justify-between items-center z-20"
  >
    <!-- Left side: Logos (ultra-compact sizing) -->
    <div class="flex items-center overflow-hidden">
      <!-- Combined logos with ultra-compact responsive sizing -->
      <div
        class="flex items-center gap-1 mobile:gap-1 sm:gap-1 laptop:gap-2 large:gap-2 mr-1 mobile:mr-1 sm:mr-2 flex-shrink-0"
      >
        <img :src="dhlLogo" alt="DHL Logo" class="h-3 mobile:h-4 sm:h-5 laptop:h-6 large:h-7" />
        <img
          :src="iLoveItLogo"
          alt="I Love IT"
          class="h-2 mobile:h-3 sm:h-4 laptop:h-5 large:h-6"
        />
      </div>
      <!-- Room name for mobile only -->
      <h1 class="text-xs mobile:text-xs lg:text-sm font-bold text-dhl-yellow truncate sm:hidden">
        {{ gameStore.currentRoom.name }}
      </h1>
    </div>

    <!-- Center: Room name for desktop (ultra-compact typography) -->
    <div class="hidden sm:flex absolute left-1/2 transform -translate-x-1/2">
      <h1
        class="text-sm sm:text-lg lg:text-xl laptop:text-2xl large:text-3xl font-bold text-dhl-yellow text-center whitespace-nowrap"
      >
        {{ gameStore.currentRoom.name }}
      </h1>
    </div>

    <!-- Right side: Timer (ultra-compact sizing) -->
    <div class="flex items-center gap-1 mobile:gap-1 sm:gap-2">
      <div
        class="text-sm mobile:text-lg sm:text-xl laptop:text-2xl large:text-3xl font-mono font-bold text-dhl-red bg-black px-1 mobile:px-2 sm:px-2 laptop:px-3 large:px-4 py-0 laptop:py-1 large:py-1 rounded"
      >
        {{ formattedTime }}
      </div>
    </div>
  </div>

  <!-- Bottom Hints Panel - Ultra-compact with good hint visibility -->
  <div
    class="absolute bottom-0 left-0 w-full px-1 py-1 mobile:px-2 mobile:py-1 sm:px-2 sm:py-1 laptop:px-3 laptop:py-1 large:px-3 large:py-1 bg-black/95 border-t border-gray-600 z-20"
  >
    <div class="max-w-6xl mx-auto text-center">
      <h3
        class="text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base font-bold text-dhl-yellow mb-1"
      >
        Security Hints
      </h3>

      <div
        v-if="roomStore.collectedHints.length === 0"
        class="text-gray-400 italic text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base"
      >
        Solve puzzles to collect hints
      </div>

      <!-- Ultra-compact horizontal hints display with good visibility -->
      <div
        class="grid grid-cols-3 gap-1 mobile:gap-1 sm:gap-2 laptop:gap-2 large:gap-3 max-w-3xl mx-auto"
      >
        <!-- Hint 1 Slot -->
        <div class="flex flex-col items-center">
          <div
            class="text-xs mobile:text-xs sm:text-xs laptop:text-xs large:text-sm text-gray-400 mb-1"
          >
            Hint 1
          </div>
          <div
            v-if="roomStore.collectedHints[0]"
            class="bg-dhl-yellow text-black px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-dhl-yellow font-bold text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base animate-pulse"
          >
            {{ roomStore.collectedHints[0] }}
          </div>
          <div
            v-else
            class="bg-gray-800 text-gray-500 px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-gray-600 text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base"
          >
            ???
          </div>
        </div>

        <!-- Hint 2 Slot -->
        <div class="flex flex-col items-center">
          <div
            class="text-xs mobile:text-xs sm:text-xs laptop:text-xs large:text-sm text-gray-400 mb-1"
          >
            Hint 2
          </div>
          <div
            v-if="roomStore.collectedHints[1]"
            class="bg-dhl-yellow text-black px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-dhl-yellow font-bold text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base animate-pulse"
          >
            {{ roomStore.collectedHints[1] }}
          </div>
          <div
            v-else
            class="bg-gray-800 text-gray-500 px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-gray-600 text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base"
          >
            ???
          </div>
        </div>

        <!-- Hint 3 Slot -->
        <div class="flex flex-col items-center">
          <div
            class="text-xs mobile:text-xs sm:text-xs laptop:text-xs large:text-sm text-gray-400 mb-1"
          >
            Hint 3
          </div>
          <div
            v-if="roomStore.collectedHints[2]"
            class="bg-dhl-yellow text-black px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-dhl-yellow font-bold text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base animate-pulse"
          >
            {{ roomStore.collectedHints[2] }}
          </div>
          <div
            v-else
            class="bg-gray-800 text-gray-500 px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-gray-600 text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base"
          >
            ???
          </div>
        </div>
      </div>

      <!-- Progress indicator - Ultra-compact -->
      <div
        class="mt-1 mobile:mt-1 laptop:mt-1 text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base text-gray-400"
      >
        {{ roomStore.collectedHints.length }}/3 collected
      </div>
    </div>
  </div>
</template>
