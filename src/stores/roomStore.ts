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
    currentRoomId.value = roomId
    levelStatus.value = { level1: 'unlocked', level2: 'locked', level3: 'locked' }
    collectedHints.value = []

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
      const allQuestions = roomQuestions.levels[levelKey].questions
      questionsForLevels.value[levelKey] = shuffle([...allQuestions]).slice(0, 3)
    })
  }

  function completeLevel(levelId: LevelId) {
    levelStatus.value[levelId] = 'solved'

    const hint = currentHints.value[levelId]
    if (hint && !collectedHints.value.includes(hint.text)) {
      collectedHints.value.push(hint.text)
    }

    if (levelId === 'level1') levelStatus.value.level2 = 'unlocked'
    if (levelId === 'level2') levelStatus.value.level3 = 'unlocked'
  }

  return {
    levelStatus,
    collectedHints,
    questionsForLevels,
    areAllLevelsSolved,
    currentSolution,
    currentHints,
    setupRoom,
    completeLevel,
  }
})
