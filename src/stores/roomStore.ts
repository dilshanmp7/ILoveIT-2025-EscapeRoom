import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LevelId, LevelStatus, Room, HintOption } from '@/types'
import { PUZZLE_DATA } from '@/gameData'

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const useRoomStore = defineStore('room', () => {
  const currentRoomId = ref<Room['id']>('it-security')
  const levelStatus = ref<Record<LevelId, LevelStatus>>({
    level1: 'unlocked',
    level2: 'locked',
    level3: 'locked',
  })
  const collectedHints = ref<string[]>([])
  const questionsForLevels = ref<Record<LevelId, any[]>>({
    level1: [],
    level2: [],
    level3: [],
  })
  // NEW: Track current question index for each level
  const currentQuestionIndex = ref<Record<LevelId, number>>({
    level1: 0,
    level2: 0,
    level3: 0,
  })
  // NEW: Track correct answers count for each level
  const correctAnswersCount = ref<Record<LevelId, number>>({
    level1: 0,
    level2: 0,
    level3: 0,
  })
  const finalPuzzle = ref<any>(null) // NEW: State for current final puzzle

  const currentSolution = ref<string>('')
  const currentHints = ref<Record<LevelId, HintOption | null>>({
    level1: null,
    level2: null,
    level3: null,
  })

  const areAllLevelsSolved = computed(() => {
    return Object.values(levelStatus.value).every((status) => status === 'solved')
  })

  function setupRoom(roomId: Room['id']) {
    console.log(`Setting up room: ${roomId}`)
    currentRoomId.value = roomId
    levelStatus.value = { level1: 'unlocked', level2: 'locked', level3: 'locked' }
    collectedHints.value = []
    // Reset current question progress
    currentQuestionIndex.value = { level1: 0, level2: 0, level3: 0 }
    // Reset correct answers count for new room
    correctAnswersCount.value = { level1: 0, level2: 0, level3: 0 }
    console.log(`Room ${roomId} setup complete - all counters reset`)

    const roomPuzzleData = PUZZLE_DATA[roomId]

    currentSolution.value = pickRandom(roomPuzzleData.finalPuzzle.solutions)
    const solutionChars = currentSolution.value.split('')

    const levelIds: LevelId[] = ['level1', 'level2', 'level3']
    levelIds.forEach((levelId, index) => {
      const charForLevel = solutionChars[index]
      const hintPool = roomPuzzleData.levels[levelId].hintOptions[charForLevel]
      if (hintPool) {
        currentHints.value[levelId] = pickRandom(hintPool)
      }
    })

    const roomQuestions = PUZZLE_DATA[roomId]
    Object.keys(roomQuestions.levels).forEach((levelId) => {
      const levelKey = levelId as LevelId
      const levelData = roomQuestions.levels[levelKey]

      // Handle new questionPools structure (e.g., for Phishing Analysis)
      if (levelData.questionPools) {
        const selectedQuestions = []
        // Select one question from each difficulty level
        selectedQuestions.push(pickRandom(levelData.questionPools.easy))
        selectedQuestions.push(pickRandom(levelData.questionPools.medium))
        selectedQuestions.push(pickRandom(levelData.questionPools.complex))
        questionsForLevels.value[levelKey] = shuffle(selectedQuestions)
      }
      // Handle legacy questions structure (for other levels)
      else if (levelData.questions) {
        const allQuestions = levelData.questions
        // Level 3 gets 4 questions, others get 3
        const questionCount = levelKey === 'level3' ? 4 : 3
        questionsForLevels.value[levelKey] = shuffle([...allQuestions]).slice(0, questionCount)
      }
    })
    finalPuzzle.value = roomPuzzleData.finalPuzzle // ADDED: Set the final puzzle
  }

  // NEW: Update current question progress
  function setCurrentQuestion(levelId: LevelId, questionIndex: number) {
    currentQuestionIndex.value[levelId] = questionIndex
  }

  // NEW: Set room ID without resetting progress (for restoration)
  function setRoomId(roomId: Room['id']) {
    currentRoomId.value = roomId
  }

  // NEW: Increment correct answers for a level
  function incrementCorrectAnswers(levelId: LevelId) {
    correctAnswersCount.value[levelId]++
  }

  // NEW: Reset correct answers for a level
  function resetCorrectAnswers(levelId: LevelId) {
    correctAnswersCount.value[levelId] = 0
  }

  function completeLevel(levelId: LevelId) {
    levelStatus.value[levelId] = 'solved'

    const hint = currentHints.value[levelId]
    if (hint && !collectedHints.value.includes(hint.text)) {
      collectedHints.value.push(hint.text)
    }

    // Reset correct answers count after level completion
    correctAnswersCount.value[levelId] = 0

    if (levelId === 'level1') levelStatus.value.level2 = 'unlocked'
    if (levelId === 'level2') levelStatus.value.level3 = 'unlocked'
  }

  // NEW: Reset function
  function reset() {
    levelStatus.value = { level1: 'unlocked', level2: 'locked', level3: 'locked' }
    collectedHints.value = []
    questionsForLevels.value = { level1: [], level2: [], level3: [] }
    currentQuestionIndex.value = { level1: 0, level2: 0, level3: 0 }
    correctAnswersCount.value = { level1: 0, level2: 0, level3: 0 } // Reset correct answers
    finalPuzzle.value = null
  }

  // NEW: Function to restore room state
  function rehydrate(state: any) {
    currentRoomId.value = state.currentRoomId
    levelStatus.value = state.levelStatus
    collectedHints.value = state.collectedHints
    questionsForLevels.value = state.questionsForLevels
    currentQuestionIndex.value = state.currentQuestionIndex || { level1: 0, level2: 0, level3: 0 }
    correctAnswersCount.value = state.correctAnswersCount || { level1: 0, level2: 0, level3: 0 } // Restore correct answers
    finalPuzzle.value = state.finalPuzzle
    currentSolution.value = state.currentSolution || ''
    currentHints.value = state.currentHints || { level1: null, level2: null, level3: null }
  }

  // NEW: Save state to localStorage
  function saveState() {
    const state = {
      currentRoomId: currentRoomId.value,
      levelStatus: levelStatus.value,
      collectedHints: collectedHints.value,
      questionsForLevels: questionsForLevels.value,
      currentQuestionIndex: currentQuestionIndex.value,
      correctAnswersCount: correctAnswersCount.value, // Save correct answers
      finalPuzzle: finalPuzzle.value,
      currentSolution: currentSolution.value,
      currentHints: currentHints.value,
    }
    localStorage.setItem('escaperoomRoomState', JSON.stringify(state))
  }

  return {
    currentRoomId, // Expose currentRoomId
    levelStatus,
    collectedHints,
    questionsForLevels,
    currentQuestionIndex, // NEW: Expose current question tracking
    correctAnswersCount, // NEW: Expose correct answers tracking
    finalPuzzle, // NEW: Expose final puzzle state
    areAllLevelsSolved,
    currentSolution,
    currentHints,
    setupRoom,
    completeLevel,
    setCurrentQuestion, // NEW: Expose function to update question progress
    setRoomId, // NEW: Expose function to set room ID without resetting progress
    incrementCorrectAnswers, // NEW: Expose correct answer increment function
    resetCorrectAnswers, // NEW: Expose correct answer reset function
    reset, // NEW: Expose reset function
    rehydrate, // NEW: Expose rehydrate function
    saveState, // NEW: Expose save function
  }
})
