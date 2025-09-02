<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])
const creds = reactive({ user: '', pass: '' })
const feedback = ref('')

function checkSolution() {
  if (
    creds.user === props.puzzleData.solution.user &&
    creds.pass === props.puzzleData.solution.pass
  ) {
    feedback.value = 'Login successful. Server rebooting...'
    setTimeout(() => emit('solved'), 1500)
  } else {
    feedback.value = 'Authentication failed.'
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">{{ puzzleData.description }}</p>
    <div class="bg-black p-4 rounded-lg font-mono text-green-400">
      <p>&gt; ssh EU_APP_SVR_01</p>
      <div class="flex items-center">
        <label>login as:</label>
        <input
          v-model="creds.user"
          type="text"
          class="bg-transparent border-none focus:ring-0 flex-grow"
        />
      </div>
      <div class="flex items-center">
        <label>password:</label>
        <input
          v-model="creds.pass"
          type="password"
          class="bg-transparent border-none focus:ring-0 flex-grow"
        />
      </div>
      <button @click="checkSolution" class="bg-gray-700 px-4 mt-2">Login</button>
      <p class="mt-4 h-6 text-dhl-red animate-pulse">&gt; {{ feedback }}</p>
    </div>
  </div>
</template>
