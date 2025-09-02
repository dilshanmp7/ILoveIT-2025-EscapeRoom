<script setup lang="ts">
import { ref } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])
const feedback = ref('')
const stories = [
  { id: 'story-ui', text: 'FE: Build new UI component' },
  { id: 'story-db', text: 'DB: Create database schema' },
  { id: 'story-api', text: 'BE: Develop API endpoint' },
]
const clickedSequence = ref<string[]>([])
function handleClick(id: string) {
  if (!clickedSequence.value.includes(id)) {
    clickedSequence.value.push(id)
  }
  if (clickedSequence.value.length === stories.length) {
    checkSolution()
  }
}
function checkSolution() {
  if (JSON.stringify(clickedSequence.value) === JSON.stringify(props.puzzleData.solution)) {
    feedback.value = 'Sprint planned successfully!'
    setTimeout(() => emit('solved'), 1500)
  } else {
    feedback.value = 'Incorrect order. Check dependencies!'
    setTimeout(() => (clickedSequence.value = []), 2000)
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">
      {{ puzzleData.description }} Click stories in the correct development order.
    </p>
    <div class="space-y-2">
      <div
        v-for="story in stories"
        :key="story.id"
        @click="handleClick(story.id)"
        class="p-4 rounded border-2 cursor-pointer bg-yellow-200 text-black"
        :class="clickedSequence.includes(story.id) ? 'bg-opacity-50' : 'hover:bg-yellow-300'"
      >
        <p v-if="clickedSequence.includes(story.id)">
          #{{ clickedSequence.indexOf(story.id) + 1 }} - {{ story.text }}
        </p>
        <p v-else>{{ story.text }}</p>
      </div>
    </div>
    <p class="text-center mt-2 h-6">{{ feedback }}</p>
  </div>
</template>
