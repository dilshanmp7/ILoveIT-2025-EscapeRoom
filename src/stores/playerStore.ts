import { defineStore } from 'pinia'
import { ref } from 'vue'
export const usePlayerStore = defineStore('player', () => {
  const score = ref<number>(100000)
  const hintsUsed = ref<number>(0)

  function useHint() {
    hintsUsed.value++
    const penalty = 1000 * Math.pow(2, hintsUsed.value - 1)
    score.value -= penalty
  }

  function applyTimePenalty(seconds: number) {
    score.value -= seconds * 10
  }

  function applyIncorrectAnswerPenalty() {
    score.value -= 250
  }

  return {
    score,
    hintsUsed,
    useHint,
    applyTimePenalty,
    applyIncorrectAnswerPenalty,
  }
})
