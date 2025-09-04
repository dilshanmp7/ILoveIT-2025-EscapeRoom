<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Room } from '@/types'
import QuizLevelBox from './QuizLevelBox.vue'
import { useRoomStore } from '@/stores/roomStore'

const props = defineProps<{ roomData: Room }>()
const emit = defineEmits(['all-levels-solved'])

const roomStore = useRoomStore()
const levelIds = computed(
  () => Object.keys(props.roomData.levels) as Array<keyof typeof props.roomData.levels>
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
  <div
    class="w-full h-full bg-cover bg-center relative flex flex-col sm:flex-row justify-around items-center p-4 sm:p-8 lg:p-24 gap-4 sm:gap-8"
    :style="{ backgroundImage: `url(${roomData.backgroundImage})` }"
  >
    <!-- Mobile: Stack puzzle boxes vertically, Desktop: Arrange horizontally -->
    <QuizLevelBox
      v-for="levelId in levelIds"
      :key="`${roomData.id}-${levelId}`"
      :level-id="levelId"
      :room-id="roomData.id"
      class="w-full sm:w-auto flex-shrink-0"
    />
  </div>
</template>
