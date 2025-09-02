<script setup lang="ts">
import { ref } from 'vue'
import type { RoomFinalPuzzle } from '@/types'
import { useRoomStore } from '@/stores/roomStore'

const props = defineProps<{ puzzleData: RoomFinalPuzzle }>()
const emit = defineEmits(['unlocked', 'close'])
const roomStore = useRoomStore()

const code = ref('')
const feedback = ref('')

function checkCode() {
  if (code.value.toUpperCase() === roomStore.currentSolution.toUpperCase()) {
    feedback.value = 'ACCESS GRANTED'
    setTimeout(() => {
      emit('unlocked')
    }, 1500)
  } else {
    feedback.value = 'ACCESS DENIED. Incorrect Code.'
    setTimeout(() => {
      feedback.value = ''
      code.value = ''
    }, 2000)
  }
}
</script>
<template>
  <div
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    @click.self="emit('close')"
  >
    <div class="bg-gray-900 border-2 border-dhl-red rounded-lg shadow-2xl w-full max-w-lg p-8">
      <h2 class="text-3xl font-bold text-dhl-red mb-2 text-center">{{ puzzleData.title }}</h2>
      <p class="text-gray-300 mb-6 text-center">{{ puzzleData.description }}</p>

      <div class="bg-black p-6 rounded">
        <form @submit.prevent="checkCode">
          <input
            v-model="code"
            type="text"
            class="w-full p-4 bg-gray-800 text-dhl-yellow text-3xl text-center font-mono rounded uppercase tracking-widest"
            autofocus
          />
        </form>
        <p
          class="text-center h-8 mt-4 text-xl font-bold animate-pulse"
          :class="{
            'text-green-500': feedback === 'ACCESS GRANTED',
            'text-red-500': feedback.includes('DENIED'),
          }"
        >
          {{ feedback }}
        </p>
      </div>
    </div>
  </div>
</template>
