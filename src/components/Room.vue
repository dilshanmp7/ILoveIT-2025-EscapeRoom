<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import type { Room } from '@/types'
import QuizLevelBox from './QuizLevelBox.vue'
import { useRoomStore } from '@/stores/roomStore'

const props = defineProps<{ roomData: Room }>()
const emit = defineEmits(['all-levels-solved'])

const roomStore = useRoomStore()
const levelIds = computed(() => {
  const ids = Object.keys(props.roomData.levels) as Array<keyof typeof props.roomData.levels>
  // Ensure proper order: level1, level2, level3
  return ids.sort()
})

// Mobile navigation state
const currentMobileLevelIndex = ref(0)
const currentMobileLevel = computed(() => levelIds.value[currentMobileLevelIndex.value])

const navigateToLevel = (direction: 'prev' | 'next') => {
  if (direction === 'prev' && currentMobileLevelIndex.value > 0) {
    currentMobileLevelIndex.value--
  } else if (direction === 'next' && currentMobileLevelIndex.value < levelIds.value.length - 1) {
    currentMobileLevelIndex.value++
  }
}

// Reset to first puzzle when room changes
watch(
  () => props.roomData.id,
  () => {
    currentMobileLevelIndex.value = 0
  },
  { immediate: true }
)

watch(
  () => roomStore.areAllLevelsSolved,
  (isSolved) => {
    if (isSolved) {
      emit('all-levels-solved')
    }
  }
)
</script>
<template>
  <div class="w-full h-full relative flex flex-col">
    <!-- Desktop: Show all levels horizontally -->
    <div class="hidden sm:flex sm:flex-row justify-around items-stretch p-8 lg:p-24 gap-8 h-full">
      <QuizLevelBox
        v-for="levelId in levelIds"
        :key="`${roomData.id}-${levelId}`"
        :level-id="levelId"
        :room-id="roomData.id"
        class="w-auto flex-shrink-0"
      />
    </div>

    <!-- Mobile: Show one level at a time with navigation -->
    <div class="sm:hidden flex flex-col h-full pt-16 pb-36">
      <!-- Mobile Navigation Header (positioned below GameUI header) -->
      <div class="flex justify-between items-center p-2 bg-black/90 border-b border-gray-600">
        <button
          @click="navigateToLevel('prev')"
          :disabled="currentMobileLevelIndex === 0"
          class="px-3 py-2 bg-dhl-red text-white rounded disabled:bg-gray-500 disabled:text-gray-300 text-sm font-bold touch-manipulation min-h-[44px]"
        >
          ← Prev
        </button>

        <div class="text-center flex-1 mx-2">
          <p class="text-white text-sm font-bold">
            Puzzle {{ currentMobileLevelIndex + 1 }} of {{ levelIds.length }}
          </p>
        </div>

        <button
          @click="navigateToLevel('next')"
          :disabled="currentMobileLevelIndex === levelIds.length - 1"
          class="px-3 py-2 bg-dhl-red text-white rounded disabled:bg-gray-500 disabled:text-gray-300 text-sm font-bold touch-manipulation min-h-[44px]"
        >
          Next →
        </button>
      </div>

      <!-- Mobile Level Indicators -->
      <div class="flex justify-center gap-2 py-2 bg-black/50">
        <div
          v-for="(levelId, index) in levelIds"
          :key="levelId"
          class="w-3 h-3 rounded-full border-2 transition-all"
          :class="{
            'bg-dhl-yellow border-dhl-yellow': index === currentMobileLevelIndex,
            'bg-green-500 border-green-500': roomStore.levelStatus[levelId] === 'solved',
            'bg-gray-600 border-gray-400': roomStore.levelStatus[levelId] === 'locked',
            'bg-transparent border-white':
              roomStore.levelStatus[levelId] === 'unlocked' && index !== currentMobileLevelIndex,
          }"
        ></div>
      </div>

      <!-- Single Mobile Level Display (with proper spacing from GameUI footer) -->
      <div class="flex-1 p-2 overflow-hidden">
        <QuizLevelBox
          :key="`mobile-${roomData.id}-${currentMobileLevel}`"
          :level-id="currentMobileLevel"
          :room-id="roomData.id"
          class="w-full h-full"
        />
      </div>
    </div>
  </div>
</template>
