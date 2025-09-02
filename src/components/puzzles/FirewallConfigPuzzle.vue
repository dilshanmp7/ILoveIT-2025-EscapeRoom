<script setup lang="ts">
import { ref } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])

const ipAddress = ref('')
const feedback = ref('')

function checkSolution() {
  if (ipAddress.value === props.puzzleData.solution) {
    feedback.value = 'IP Blocked. Network traffic is stabilizing.'
    setTimeout(() => emit('solved'), 1500)
  } else {
    feedback.value = 'Incorrect IP. The attack continues.'
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">{{ puzzleData.description }}</p>
    <div class="bg-black p-4 rounded-lg font-mono text-green-400">
      <p>&gt; Enter IP to add to DENY list:</p>
      <form @submit.prevent="checkSolution">
        <input
          v-model="ipAddress"
          type="text"
          class="bg-transparent border-b-2 w-full focus:ring-0 focus:border-dhl-yellow"
          autofocus
        />
      </form>
      <p class="mt-4 h-6 text-dhl-red animate-pulse">&gt; {{ feedback }}</p>
    </div>
  </div>
</template>
