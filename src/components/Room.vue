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
  return ids.sort()
})

const currentMobileLevelIndex = ref(0)
const currentMobileLevel = computed(() => levelIds.value[currentMobileLevelIndex.value])

const navigateToLevel = (direction: 'prev' | 'next') => {
  if (direction === 'prev' && currentMobileLevelIndex.value > 0) {
    currentMobileLevelIndex.value--
  } else if (direction === 'next' && currentMobileLevelIndex.value < levelIds.value.length - 1) {
    currentMobileLevelIndex.value++
  }
}

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
  <div class="w-full h-full p-1 sm:p-2">
    <div
      class="hidden sm:flex sm:flex-row justify-around items-stretch gap-1 sm:gap-2 md:gap-3 lg:gap-4 h-full w-full"
    >
      <QuizLevelBox
        v-for="levelId in levelIds"
        :key="`${roomData.id}-${levelId}`"
        :level-id="levelId"
        :room-id="roomData.id"
        class="flex-1"
      />
    </div>

    <div class="sm:hidden flex flex-col h-full w-full">
      <div
        class="flex justify-between items-center p-1 bg-black/90 border-b border-gray-600 flex-shrink-0"
      >
        <button
          @click="navigateToLevel('prev')"
          :disabled="currentMobileLevelIndex === 0"
          class="px-2 py-1 bg-dhl-red text-white rounded disabled:bg-gray-500 text-xs font-bold"
        >
          ← Prev
        </button>
        <p class="text-white text-xs font-bold">
          Puzzle {{ currentMobileLevelIndex + 1 }} of {{ levelIds.length }}
        </p>
        <button
          @click="navigateToLevel('next')"
          :disabled="currentMobileLevelIndex === levelIds.length - 1"
          class="px-2 py-1 bg-dhl-red text-white rounded disabled:bg-gray-500 text-xs font-bold"
        >
          Next →
        </button>
      </div>

      <div class="flex-1 p-1 overflow-hidden">
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
