<script setup lang="ts">
import { ref } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])

const searchKey = ref('')
const feedback = ref('')

function checkSolution() {
  if (searchKey.value.toUpperCase() === props.puzzleData.solution) {
    feedback.value = 'Article Found! Access key retrieved.'
    setTimeout(() => emit('solved'), 1500)
  } else {
    feedback.value = 'No results found for that key.'
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">{{ puzzleData.description }}</p>
    <div class="bg-gray-200 text-black p-4 rounded-lg">
      <h3 class="font-bold">IT Knowledge Base</h3>
      <p>Search for procedure:</p>
      <form @submit.prevent="checkSolution">
        <input
          v-model="searchKey"
          type="text"
          class="w-full p-1 border-2 border-gray-400 uppercase"
        />
      </form>
      <p class="mt-2 h-6 text-red-600 font-bold">{{ feedback }}</p>
    </div>
  </div>
</template>
