<script setup lang="ts">
import { ref } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])

const decryptionKey = ref('')
const feedback = ref('')

function checkSolution() {
  if (decryptionKey.value.toUpperCase() === props.puzzleData.solution) {
    feedback.value = 'DECRYPTION SUCCESSFUL. Access key retrieved.'
    setTimeout(() => emit('solved'), 1500)
  } else {
    feedback.value = 'DECRYPTION FAILED. Incorrect key.'
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">{{ puzzleData.description }}</p>
    <div class="bg-black p-4 rounded-lg font-mono text-green-400">
      <p class="text-gray-500 break-all">
        Encrypted Log: 2J5F8K9L3P0A7G4H1Q6W... (corruption detected)
      </p>
      <p class="mt-4">&gt; Enter Decryption Key:</p>
      <form @submit.prevent="checkSolution">
        <input
          v-model="decryptionKey"
          type="text"
          class="bg-transparent border-b-2 w-full focus:ring-0 focus:border-dhl-yellow uppercase"
          autofocus
        />
      </form>
      <p class="mt-4 h-6 text-dhl-red animate-pulse">&gt; {{ feedback }}</p>
    </div>
  </div>
</template>
