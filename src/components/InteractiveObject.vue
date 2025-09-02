<script setup lang="ts">
import { computed } from 'vue'
import type { InteractiveObject } from '@/types'
import { usePuzzleStore } from '@/stores/puzzleStore'

const props = defineProps<{
  objectData: InteractiveObject
}>()

const puzzleStore = usePuzzleStore()

const isVisible = computed(() => {
  if (!props.objectData.linkedPuzzleId) return true
  const puzzleStatus = puzzleStore.getPuzzleStatus(props.objectData.linkedPuzzleId)
  // This logic can be expanded. E.g., object appears when a PREVIOUS puzzle is solved.
  // For now, let's make puzzles appear when they are unlocked.
  return puzzleStatus === 'unlocked' || puzzleStatus === 'solved'
})

const objectStyle = computed(() => props.objectData.position)
</script>

<template>
  <div
    v-if="isVisible"
    class="absolute border-2 border-dhl-yellow border-dashed opacity-50 hover:opacity-100 hover:bg-dhl-yellow/30 cursor-pointer transition-all duration-300"
    :style="objectStyle"
    :title="objectData.name"
  ></div>
</template>
