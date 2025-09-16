<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRoomStore } from '@/stores/roomStore'

const gameStore = useGameStore()
const roomStore = useRoomStore()

const roomName = computed(() => gameStore.currentRoom.name)
</script>

<template>
  <footer
    class="relative w-full px-1 py-1 mobile:px-2 mobile:py-1 sm:px-2 sm:py-1 laptop:px-3 laptop:py-1 large:px-3 large:py-1 bg-black/95 border-t border-gray-600 z-20"
  >
    <div class="max-w-6xl mx-auto text-center">
      <h3
        class="text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base font-bold text-dhl-yellow mb-1"
      >
        {{ roomName }} Hints
      </h3>

      <div
        v-if="roomStore.collectedHints.length === 0"
        class="text-gray-400 italic text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base"
      >
        Solve puzzles to collect hints
      </div>

      <div
        class="grid grid-cols-3 gap-1 mobile:gap-1 sm:gap-2 laptop:gap-2 large:gap-3 max-w-3xl mx-auto"
      >
        <div v-for="i in 3" :key="i" class="flex flex-col items-center">
          <div
            class="text-xs mobile:text-xs sm:text-xs laptop:text-xs large:text-sm text-gray-400 mb-1"
          >
            Hint {{ i }}
          </div>
          <div
            v-if="roomStore.collectedHints[i - 1]"
            class="bg-dhl-yellow text-black px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-dhl-yellow font-bold text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base animate-pulse"
          >
            {{ roomStore.collectedHints[i - 1] }}
          </div>
          <div
            v-else
            class="bg-gray-800 text-gray-500 px-1 mobile:px-1 sm:px-2 laptop:px-2 large:px-3 py-1 mobile:py-1 sm:py-1 laptop:py-1 large:py-2 rounded-lg border-2 border-gray-600 text-center w-full text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base"
          >
            ???
          </div>
        </div>
      </div>

      <div
        class="mt-1 mobile:mt-1 laptop:mt-1 text-xs mobile:text-xs sm:text-xs laptop:text-sm large:text-base text-gray-400"
      >
        {{ roomStore.collectedHints.length }}/3 collected
      </div>
    </div>
  </footer>
</template>
