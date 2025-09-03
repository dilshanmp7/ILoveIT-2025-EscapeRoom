import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // NEW: State for player information
  const firstName = ref('')
  const lastName = ref('')
  const department = ref('')
  const workTime = ref('')

  const score = ref<number>(100000)
  const hintsUsed = ref<number>(0)

  // NEW: Action to set player info
  function setPlayerInfo(info: {
    firstName: string
    lastName: string
    department: string
    workTime: string
  }) {
    firstName.value = info.firstName
    lastName.value = info.lastName
    department.value = info.department
    workTime.value = info.workTime
  }

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

  // NEW: Reset function
  function reset() {
    firstName.value = ''
    lastName.value = ''
    department.value = ''
    workTime.value = ''
    score.value = 100000
    hintsUsed.value = 0
  }

  // NEW: Function to restore player state
  function rehydrate(state: any) {
    firstName.value = state.firstName
    lastName.value = state.lastName
    department.value = state.department
    workTime.value = state.workTime
    score.value = state.score
    hintsUsed.value = state.hintsUsed
  }

  // NEW: Save state to localStorage
  function saveState() {
    const state = {
      firstName: firstName.value,
      lastName: lastName.value,
      department: department.value,
      workTime: workTime.value,
      score: score.value,
      hintsUsed: hintsUsed.value,
    }
    localStorage.setItem('escaperoomPlayerState', JSON.stringify(state))
  }

  return {
    firstName,
    lastName,
    department,
    workTime,
    score,
    hintsUsed,
    setPlayerInfo, // EXPOSED: Make the new action available
    useHint,
    applyTimePenalty,
    applyIncorrectAnswerPenalty,
    reset, // NEW: Expose reset function
    rehydrate, // NEW: Expose rehydrate function
    saveState, // NEW: Expose save function
  }
})
