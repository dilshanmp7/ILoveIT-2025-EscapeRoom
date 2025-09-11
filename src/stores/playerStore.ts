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

  // Enhanced scoring logic (0-100 points) - NEW SPECIFICATION
  const finalScore = computed(() => {
    const maxScore = 100
    let score = maxScore

    const elapsedSeconds = Math.floor((endTime.value - startTime.value) / 1000)
    const wrongAnswersCount = wrongAnswerPenalties.value

    // Case 1: Perfect run bonus - Finished within 1 minute without mistakes
    if (elapsedSeconds <= 60 && wrongAnswersCount === 0) {
      return maxScore // 100 points
    }

    // Case 2: Apply time penalty if > 1 minute (scaled, not whole minutes)
    if (elapsedSeconds > 60) {
      const extraMinutes = (elapsedSeconds - 60) / 60 // fractional minutes
      const TIME_PENALTY_VALUE = 2 // adjust difficulty here
      score -= extraMinutes * TIME_PENALTY_VALUE
    }

    // Case 3: Apply penalty for wrong answers
    const WRONG_ANSWER_PENALTY = 5 // 5 points per wrong answer
    score -= wrongAnswersCount * WRONG_ANSWER_PENALTY

    // Case 4: Apply hints penalty
    const HINT_PENALTY = 3 // 3 points per hint
    score -= hintsUsed.value * HINT_PENALTY

    // Case 5: Apply completion bonus
    score += completionBonus.value

    // Case 6: Ensure score boundaries (0 – 100)
    if (score > maxScore) {
      score = maxScore
    }
    if (score < 0) {
      score = 0
    }

    return Math.round(score) // Return whole number
  })

  // Computed time penalty for display purposes - NEW SPECIFICATION
  const timePenalty = computed(() => {
    const elapsedSeconds = Math.floor((endTime.value - startTime.value) / 1000)

    if (elapsedSeconds <= 60) {
      return 0 // No penalty for 1 minute or less
    }

    const extraMinutes = (elapsedSeconds - 60) / 60 // fractional minutes
    const TIME_PENALTY_VALUE = 2 // 2 points per minute (fractional)
    return Math.round(extraMinutes * TIME_PENALTY_VALUE * 10) / 10 // Round to 1 decimal
  })

  // Computed hints penalty for display purposes
  const hintsPenalty = computed(() => {
    const HINT_PENALTY = 3 // 3 points per hint
    return hintsUsed.value * HINT_PENALTY
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

  function deductHintPenalty() {
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

  // ✅ BACKUP STRATEGY + CENTRALIZED DATA COLLECTION
  // Enhanced saveToLeaderboard with backend integration
  async function saveToLeaderboard() {
    const playerResult = {
      firstName: firstName.value,
      lastName: lastName.value,
      department: department.value,
      workTime: workTime.value,
      score: finalScore.value,
      timeSpent: timeSpent.value,
      wrongAnswers: wrongAnswerPenalties.value,
      hintsUsed: hintsUsed.value,
      completionTime: new Date().toISOString(),
      timestamp: Date.now(),
    }

    // 1. ✅ BACKUP STRATEGY - Always save to localStorage first
    try {
      const existingResults = JSON.parse(localStorage.getItem('leaderboard') || '[]')

      // Remove any previous entry by same player to prevent duplicates
      const filteredResults = existingResults.filter(
        (result: any) =>
          !(
            result.firstName === playerResult.firstName &&
            result.lastName === playerResult.lastName &&
            result.department === playerResult.department
          )
      )

      filteredResults.push(playerResult)
      localStorage.setItem('leaderboard', JSON.stringify(filteredResults))
      console.log('✅ Score saved to local backup')
    } catch (localError) {
      console.error('⚠️ Local storage backup failed:', localError)
    }

    // 2. ✅ CENTRALIZED DATA COLLECTION - Submit to backend with timeout
    try {
      console.log('🚀 Submitting score to tournament API...')

      // Create AbortController for timeout handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      const response = await fetch('/api/submit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerResult),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const result = await response.json()

      if (result.success) {
        console.log(`🏆 Score submitted to tournament! Your rank: #${result.rank}`)

        // Show success message to player
        const message =
          result.message + (result.rank ? ` You're currently ranked #${result.rank}!` : '')

        return {
          success: true,
          message,
          rank: result.rank,
          submittedToCentral: true,
        }
      } else {
        // Handle tournament restriction (already participated)
        if (result.alreadyParticipated) {
          console.log('🚫 Player already participated in tournament')
          return {
            success: false,
            message: result.message,
            alreadyParticipated: true,
            previousScore: result.previousScore,
            previousRank: result.previousRank,
            submittedToCentral: false,
          }
        }
        throw new Error(result.error || 'Backend submission failed')
      }
    } catch (backendError) {
      console.error('⚠️ Backend submission failed:', backendError)

      // Check if it's a timeout/abort error
      if (backendError instanceof Error && backendError.name === 'AbortError') {
        console.log('⏱️ Tournament API timeout - score saved locally')
        return {
          success: true,
          message:
            'Tournament server is busy. Your score is saved locally and will sync when the server is available.',
          rank: null,
          submittedToCentral: false,
          error: 'Tournament API timeout',
        }
      }

      console.log('📱 Score saved locally only - will sync when online')

      return {
        success: true,
        message: 'Score saved locally. Will sync to tournament when connection is available.',
        rank: null,
        submittedToCentral: false,
        error: backendError instanceof Error ? backendError.message : 'Unknown error',
      }
    }
  }

  // ✅ REAL-TIME LEADERBOARD - Fetch current tournament standings
  async function getCurrentRank() {
    try {
      const response = await fetch('/api/leaderboard?limit=10')
      const data = await response.json()

      if (data.success) {
        // Find current player's position
        const playerEntry = data.leaderboard.find(
          (entry: any) =>
            entry.firstName === firstName.value &&
            entry.lastName === lastName.value &&
            entry.department === department.value
        )

        return {
          currentRank: playerEntry?.rank || null,
          totalPlayers: data.totalPlayers,
          topScore: data.topScore,
          leaderboard: data.leaderboard.slice(0, 5), // Top 5 for display
        }
      }
    } catch (error) {
      console.error('Failed to fetch current rank:', error)
    }

    return null
  }

  // ✅ DUPLICATE PREVENTION - Check if player already played
  async function checkExistingScore() {
    try {
      const response = await fetch('/api/leaderboard?limit=1000')
      const data = await response.json()

      if (data.success) {
        const existingPlayer = data.leaderboard.find(
          (entry: any) =>
            entry.firstName === firstName.value &&
            entry.lastName === lastName.value &&
            entry.department === department.value
        )

        return existingPlayer || null
      }
    } catch (error) {
      console.error('Failed to check existing score:', error)
    }

    return null
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
    hintsPenalty,
    timeSpent,
    setPlayerInfo,
    startTiming,
    endTiming,
    useHint,
    deductHintPenalty,
    applyIncorrectAnswerPenalty,
    setCompletionBonus,
    reset,
    saveToLeaderboard,
    getCurrentRank,
    checkExistingScore,
    rehydrate,
    persist,
  }
})
