<script setup lang="ts">
import { ref } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])

const selectedLine = ref<number | null>(null)
const feedback = ref('')

const code = [
  'function calculateTotal(items) {',
  '  let total = 0;',
  '  for (let i = 1; i < items.length; i++) {',
  '    total += items[i].price;',
  '  }',
  '  return total;',
  '}',
]

function selectLine(lineNumber: number) {
  selectedLine.value = lineNumber
  if (lineNumber === props.puzzleData.solution) {
    feedback.value = 'Bug found! Patching... Password is: PATCH_DEPLOY_GAMMA'
    setTimeout(() => emit('solved'), 2500)
  } else {
    feedback.value = 'That line seems correct. The bug must be elsewhere.'
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">{{ puzzleData.description }}</p>
    <div class="bg-gray-800 p-4 rounded-lg font-mono">
      <div
        v-for="(line, index) in code"
        :key="index"
        @click="selectLine(index + 1)"
        class="cursor-pointer hover:bg-white/10"
        :class="{ 'bg-red-500/50': selectedLine === index + 1 }"
      >
        <span class="text-gray-500 pr-4">{{ index + 1 }}</span>
        <span>{{ line }}</span>
      </div>
    </div>
    <p class="text-center mt-2 h-6">{{ feedback }}</p>
  </div>
</template>
