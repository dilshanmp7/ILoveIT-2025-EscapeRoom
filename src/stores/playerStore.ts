import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // Player information
  const firstName = ref('')
  const lastName = ref('')
  const department = ref('')
  const workTime = ref('')

  // Scoring components
  const baseScore = ref<number>(100) // Start with perfect score
  const wrongAnswerPenalties = ref<number>(0) // Track wrong answers
  const hintsUsed = ref<number>(0)
  const completionBonus = ref<number>(0) // Bonus for completing all rooms
  const startTime = ref<number>(0)
  const endTime = ref<number>(0)

  // Enhanced scoring logic (0-100 points)
  const finalScore = computed(() => {
    let score = baseScore.value

    // Time penalty: SECOND-BASED scoring for 1000+ player tournament
    // Perfect time: 300 seconds (5 minutes) or less = no penalty
    // Every second over 300 = -0.1 points
    // This creates very fine granularity for competitive ranking
    const elapsedSeconds = Math.floor((endTime.value - startTime.value) / 1000)
    const perfectTimeSeconds = 300 // 5 minutes in seconds
    let timePenalty = 0

    if (elapsedSeconds > perfectTimeSeconds) {
      // Each second over 5 minutes = -0.1 points
      const excessSeconds = elapsedSeconds - perfectTimeSeconds
      timePenalty = excessSeconds * 0.1
    }

    // Cap maximum time penalty at 80 points (leaving minimum 20 points possible)
    timePenalty = Math.min(80, timePenalty)

    // Wrong answer penalty: -5 points each
    const wrongAnswerPenalty = wrongAnswerPenalties.value * 5

    // Hint penalty: -3 points each
    const hintPenalty = hintsUsed.value * 3

    // Apply penalties
    score = score - timePenalty - wrongAnswerPenalty - hintPenalty

    // Add completion bonus
    score = score + completionBonus.value

    // Ensure score stays within 0-100 range
    return Math.max(0, Math.min(100, Math.round(score * 10) / 10)) // Round to 1 decimal
  })

  // Computed time penalty for display purposes
  const timePenalty = computed(() => {
    const elapsedSeconds = Math.floor((endTime.value - startTime.value) / 1000)
    const perfectTimeSeconds = 300 // 5 minutes
    let penalty = 0

    if (elapsedSeconds > perfectTimeSeconds) {
      const excessSeconds = elapsedSeconds - perfectTimeSeconds
      penalty = excessSeconds * 0.1
    }

    return Math.min(80, Math.round(penalty * 10) / 10) // Round to 1 decimal
  })

  // Computed time spent in a readable format
  const timeSpent = computed(() => {
    if (startTime.value === 0 || endTime.value === 0) return '00:00'
    const totalSeconds = Math.floor((endTime.value - startTime.value) / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

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

  function startTiming() {
    startTime.value = Date.now()
  }

  function endTiming() {
    endTime.value = Date.now()
  }

  function useHint() {
    hintsUsed.value++
  }

  function applyIncorrectAnswerPenalty() {
    wrongAnswerPenalties.value++
  }

  function setCompletionBonus(rooms: number) {
    // Bonus for completing all rooms: +10 points
    completionBonus.value = rooms === 3 ? 10 : 0
  }

  function reset() {
    firstName.value = ''
    lastName.value = ''
    department.value = ''
    workTime.value = ''
    baseScore.value = 100
    wrongAnswerPenalties.value = 0
    hintsUsed.value = 0
    completionBonus.value = 0
    startTime.value = 0
    endTime.value = 0
  }

  // Save player data to localStorage (for leaderboard)
  function saveToLeaderboard() {
    const playerResult = {
      firstName: firstName.value,
      lastName: lastName.value,
      department: department.value,
      workTime: workTime.value,
      score: finalScore.value,
      timeSpent: timeSpent.value,
      timestamp: Date.now(),
    }

    // Save to leaderboard
    const existingResults = JSON.parse(localStorage.getItem('leaderboard') || '[]')
    existingResults.push(playerResult)
    localStorage.setItem('leaderboard', JSON.stringify(existingResults))
  }

  // Load player data from localStorage
  function rehydrate() {
    const saved = localStorage.getItem('playerStore')
    if (saved) {
      const state = JSON.parse(saved)
      firstName.value = state.firstName || ''
      lastName.value = state.lastName || ''
      department.value = state.department || ''
      workTime.value = state.workTime || ''
      baseScore.value = state.baseScore || 100
      wrongAnswerPenalties.value = state.wrongAnswerPenalties || 0
      hintsUsed.value = state.hintsUsed || 0
      completionBonus.value = state.completionBonus || 0
      startTime.value = state.startTime || 0
      endTime.value = state.endTime || 0
    }
  }

  // Save player data to localStorage
  function persist() {
    localStorage.setItem(
      'playerStore',
      JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        department: department.value,
        workTime: workTime.value,
        baseScore: baseScore.value,
        wrongAnswerPenalties: wrongAnswerPenalties.value,
        hintsUsed: hintsUsed.value,
        completionBonus: completionBonus.value,
        startTime: startTime.value,
        endTime: endTime.value,
      })
    )
  }

  return {
    firstName,
    lastName,
    department,
    workTime,
    baseScore,
    wrongAnswerPenalties,
    hintsUsed,
    completionBonus,
    startTime,
    endTime,
    finalScore,
    timePenalty,
    timeSpent,
    setPlayerInfo,
    startTiming,
    endTiming,
    useHint,
    applyIncorrectAnswerPenalty,
    setCompletionBonus,
    reset,
    saveToLeaderboard,
    rehydrate,
    persist,
  }
})
