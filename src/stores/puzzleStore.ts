import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PUZZLES } from '@/gameData'

type PuzzleStatus = 'locked' | 'unlocked' | 'solved'

export const usePuzzleStore = defineStore('puzzle', () => {
  const puzzleStates = ref<Record<string, { status: PuzzleStatus; attempts: number }>>({})

  function initializePuzzles() {
    const initialState: Record<string, { status: PuzzleStatus; attempts: number }> = {}
    Object.keys(PUZZLES).forEach((puzzleId, index) => {
      initialState[puzzleId] = {
        // First puzzle is unlocked, rest are locked
        status: index === 0 ? 'unlocked' : 'locked',
        attempts: 0,
      }
    })
    puzzleStates.value = initialState
  }

  const getPuzzleStatus = computed(() => {
    return (puzzleId: string) => puzzleStates.value[puzzleId]?.status || 'locked'
  })

  function solvePuzzle(puzzleId: string) {
    if (puzzleStates.value[puzzleId]) {
      puzzleStates.value[puzzleId].status = 'solved'

      // Unlock the next puzzle in sequence
      const puzzleIds = Object.keys(PUZZLES)
      const currentIndex = puzzleIds.indexOf(puzzleId)
      if (currentIndex < puzzleIds.length - 1) {
        const nextPuzzleId = puzzleIds[currentIndex + 1]
        if (puzzleStates.value[nextPuzzleId]) {
          puzzleStates.value[nextPuzzleId].status = 'unlocked'
        }
      }
    }
  }

  function incrementAttempts(puzzleId: string) {
    if (puzzleStates.value[puzzleId]) {
      puzzleStates.value[puzzleId].attempts++
    }
  }

  return {
    puzzleStates,
    initializePuzzles,
    getPuzzleStatus,
    solvePuzzle,
    incrementAttempts,
  }
})
