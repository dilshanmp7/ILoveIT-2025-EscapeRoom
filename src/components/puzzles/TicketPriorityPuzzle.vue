<script setup lang="ts">
import { ref } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])
const feedback = ref('')

const tickets = [
  { id: 'ticket-1', text: 'P2: User cannot print' },
  { id: 'ticket-2', text: 'P3: Request for new mouse' },
  { id: 'ticket-3', text: 'P1: Entire EU network is offline' },
]
const clickedSequence = ref<string[]>([])
function handleClick(id: string) {
  if (!clickedSequence.value.includes(id)) {
    clickedSequence.value.push(id)
  }
  if (clickedSequence.value.length === tickets.length) {
    checkSolution()
  }
}
function checkSolution() {
  if (JSON.stringify(clickedSequence.value) === JSON.stringify(props.puzzleData.solution)) {
    feedback.value = 'Correct! Critical incidents are being addressed.'
    setTimeout(() => emit('solved'), 1500)
  } else {
    feedback.value = 'Incorrect order. SLA breach imminent!'
    setTimeout(() => (clickedSequence.value = []), 2000)
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">
      {{ puzzleData.description }} Click the tickets in order of highest to lowest priority.
    </p>
    <div class="space-y-2">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        @click="handleClick(ticket.id)"
        class="p-4 rounded border-2 cursor-pointer"
        :class="
          clickedSequence.includes(ticket.id) ? 'bg-blue-500' : 'border-gray-600 hover:bg-gray-700'
        "
      >
        <p v-if="clickedSequence.includes(ticket.id)">
          #{{ clickedSequence.indexOf(ticket.id) + 1 }} - {{ ticket.text }}
        </p>
        <p v-else>{{ ticket.text }}</p>
      </div>
    </div>
    <p class="text-center mt-2 h-6">{{ feedback }}</p>
  </div>
</template>
