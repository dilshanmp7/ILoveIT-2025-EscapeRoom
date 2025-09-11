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
    <!-- Desktop: Show all levels horizontally - Ultra-constrained boundaries -->
    <div
      class="hidden sm:flex sm:flex-row justify-around items-stretch gap-1 mobile:gap-2 sm:gap-3 laptop:gap-4 large:gap-6 laptop-game-container large-game-container"
      style="
        position: absolute;
        top: 42px;
        left: 4px;
        right: 4px;
        bottom: 62px;
        height: calc(100vh - 104px);
        padding: 4px;
        overflow: hidden;
      "
    >
      <QuizLevelBox
        v-for="levelId in levelIds"
        :key="`${roomData.id}-${levelId}`"
        :level-id="levelId"
        :room-id="roomData.id"
        class="w-auto flex-1 laptop-quiz-content large-quiz-content"
        style="height: calc(100% - 90px); max-height: calc(100% - 90px); overflow: hidden"
      />
    </div>

    <!-- Mobile: Show one level at a time with navigation - Ultra-constrained boundaries -->
    <div
      class="sm:hidden flex flex-col"
      style="
        position: absolute;
        top: 37px;
        left: 2px;
        right: 2px;
        bottom: 57px;
        height: calc(100vh - 94px);
        overflow: hidden;
      "
    >
      <!-- Mobile Navigation Header - Ultra-constrained within thin bounds -->
      <div
        class="flex justify-between items-center p-1 mobile:p-1 bg-black/90 border-b border-gray-600 flex-shrink-0"
        style="height: 38px"
      >
        <button
          @click="navigateToLevel('prev')"
          :disabled="currentMobileLevelIndex === 0"
          class="px-2 mobile:px-2 py-1 mobile:py-1 bg-dhl-red text-white rounded disabled:bg-gray-500 disabled:text-gray-300 text-xs mobile:text-sm font-bold touch-manipulation min-h-[32px] min-w-[45px] mobile:min-w-[50px]"
        >
          ← Prev
        </button>

        <div class="text-center flex-1 mx-1 mobile:mx-1">
          <p class="text-white text-xs mobile:text-xs font-bold">
            Puzzle {{ currentMobileLevelIndex + 1 }} of {{ levelIds.length }}
          </p>
        </div>

        <button
          @click="navigateToLevel('next')"
          :disabled="currentMobileLevelIndex === levelIds.length - 1"
          class="px-2 mobile:px-2 py-1 mobile:py-1 bg-dhl-red text-white rounded disabled:bg-gray-500 disabled:text-gray-300 text-xs mobile:text-sm font-bold touch-manipulation min-h-[32px] min-w-[45px] mobile:min-w-[50px]"
        >
          Next →
        </button>
      </div>

      <!-- Mobile Level Indicators - Ultra-compact -->
      <div
        class="flex justify-center gap-1 mobile:gap-1 py-1 mobile:py-1 bg-black/50 flex-shrink-0"
        style="height: 22px"
      >
        <div
          v-for="(levelId, index) in levelIds"
          :key="levelId"
          class="w-2 h-2 mobile:w-2 mobile:h-2 rounded-full border-2 transition-all"
          :class="{
            'bg-dhl-yellow border-dhl-yellow': index === currentMobileLevelIndex,
            'bg-green-500 border-green-500': roomStore.levelStatus[levelId] === 'solved',
            'bg-gray-600 border-gray-400': roomStore.levelStatus[levelId] === 'locked',
            'bg-transparent border-white':
              roomStore.levelStatus[levelId] === 'unlocked' && index !== currentMobileLevelIndex,
          }"
        ></div>
      </div>

      <!-- Single Mobile Level Display - Centered with balanced padding -->
      <div
        class="flex-1 px-2 py-1 mobile:px-3 mobile:py-1"
        style="height: calc(100% - 60px); overflow: hidden"
      >
        <QuizLevelBox
          :key="`mobile-${roomData.id}-${currentMobileLevel}`"
          :level-id="currentMobileLevel"
          :room-id="roomData.id"
          class="w-full h-full"
          style="max-height: calc(100% - 90px); overflow: hidden"
        />
      </div>
    </div>
  </div>
</template>
