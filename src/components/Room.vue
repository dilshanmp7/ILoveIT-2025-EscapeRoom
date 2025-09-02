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
    class="w-full h-full bg-cover bg-center relative flex justify-around items-center p-24"
    :style="{ backgroundImage: `url(${roomData.backgroundImage})` }"
  >
    <QuizLevelBox
      v-for="levelId in levelIds"
      :key="`${roomData.id}-${levelId}`"
      :level-id="levelId"
      :room-id="roomData.id"
    />
  </div>
</template>
