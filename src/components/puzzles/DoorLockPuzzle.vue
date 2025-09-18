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
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 mobile:p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-gray-900 border-2 border-dhl-red rounded-lg shadow-2xl w-full max-w-xs mobile:max-w-sm sm:max-w-md laptop:max-w-lg large:max-w-xl p-4 mobile:p-6 sm:p-8 laptop:p-10"
    >
      <h2
        class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl font-bold text-dhl-red mb-1 mobile:mb-2 laptop:mb-3 text-center"
      >
        {{ puzzleData.title }}
      </h2>
      <p
        class="text-gray-300 mb-4 mobile:mb-6 laptop:mb-8 text-center text-sm mobile:text-base laptop:text-lg large:text-xl"
      >
        {{ puzzleData.description }}
      </p>

      <div class="bg-black p-3 mobile:p-4 sm:p-6 laptop:p-8 rounded">
        <form @submit.prevent="checkCode" class="flex flex-col gap-3 items-center">
          <input
            v-model="code"
            type="text"
            class="w-full p-3 mobile:p-4 laptop:p-5 large:p-6 bg-gray-800 text-dhl-yellow text-2xl mobile:text-3xl laptop:text-4xl large:text-5xl text-center font-mono rounded uppercase tracking-widest touch-manipulation"
            autofocus
            placeholder=""
          />
          <button
            type="submit"
            :disabled="!code"
            class="px-4 py-2 rounded bg-dhl-yellow text-gray-900 font-bold text-lg laptop:text-xl large:text-2xl transition-opacity duration-200"
            :class="{ 'opacity-50 cursor-not-allowed': !code, 'hover:bg-yellow-400': code }"
          >
            Submit
          </button>
        </form>
        <p
          class="text-center h-6 mobile:h-8 laptop:h-10 large:h-12 mt-3 mobile:mt-4 laptop:mt-6 text-base mobile:text-lg sm:text-xl laptop:text-2xl large:text-3xl font-bold animate-pulse"
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
