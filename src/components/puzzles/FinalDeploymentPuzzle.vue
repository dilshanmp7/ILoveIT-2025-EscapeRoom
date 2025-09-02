<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Puzzle } from '@/types'

const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])

const keys = reactive({ key1: '', key2: '', key3: '' })
const feedback = ref('')

function checkSolution() {
  const sol = props.puzzleData.solution
  if (
    keys.key1.toUpperCase() === sol.key1 &&
    keys.key2.toUpperCase() === sol.key2 &&
    keys.key3.toUpperCase() === sol.key3
  ) {
    feedback.value = 'VALIDATION SUCCESSFUL. DEPLOYMENT INITIATED.'
    setTimeout(() => emit('solved'), 2000)
  } else {
    feedback.value = 'VALIDATION FAILED. CHECK ACCESS KEYS.'
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">{{ puzzleData.description }}</p>

    <div class="space-y-4 bg-gray-800 p-6 rounded-lg">
      <div>
        <label class="block text-dhl-yellow font-bold mb-1">IT Services Access Key:</label>
        <input v-model="keys.key1" type="text" class="w-full p-2 bg-gray-900 rounded uppercase" />
      </div>
      <div>
        <label class="block text-dhl-yellow font-bold mb-1">IT Applications Access Key:</label>
        <input v-model="keys.key2" type="text" class="w-full p-2 bg-gray-900 rounded uppercase" />
      </div>
      <div>
        <label class="block text-dhl-yellow font-bold mb-1">Final Patch Password:</label>
        <input v-model="keys.key3" type="text" class="w-full p-2 bg-gray-900 rounded uppercase" />
      </div>
      <button
        @click="checkSolution"
        class="w-full bg-dhl-red text-white font-bold p-3 mt-4 rounded text-xl"
      >
        DEPLOY TO PRODUCTION
      </button>
    </div>
    <p class="text-center mt-4 h-6 text-lg font-bold">{{ feedback }}</p>
  </div>
</template>
