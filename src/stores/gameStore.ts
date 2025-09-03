import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ROOM_DATA } from '@/gameData'
import { useRoomStore } from './roomStore'
import { usePlayerStore } from './playerStore'

export const useGameStore = defineStore('game', () => {
  const gameState = ref<'intro' | 'playing' | 'paused' | 'finished'>('intro')
  const currentRoomIndex = ref<number>(0)
  const startTime = ref<number>(0)
  const currentTime = ref<number>(0)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const roomStore = useRoomStore()
  const playerStore = usePlayerStore()

  const currentRoom = computed(() => {
    return ROOM_DATA[currentRoomIndex.value]
  })

  const elapsedTime = computed(() => {
    if (startTime.value === 0) return 0
    // Cap elapsed time at 1 hour (3600 seconds)
    return Math.min(3600, Math.floor((currentTime.value - startTime.value) / 1000))
  })

  function startGame() {
    console.log('startGame function called')
    console.log('Current gameState before:', gameState.value)

    roomStore.setupRoom(ROOM_DATA[0].id)
    currentRoomIndex.value = 0
    startTime.value = Date.now()
    currentTime.value = Date.now()
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      currentTime.value = Date.now()
    }, 1000)
    gameState.value = 'playing'

    console.log('gameState after:', gameState.value)
    console.log('startTime set to:', startTime.value)
  }

  function advanceToNextRoom() {
    if (currentRoomIndex.value < ROOM_DATA.length - 1) {
      currentRoomIndex.value++
      roomStore.setupRoom(currentRoom.value.id)
    } else {
      endGame(true) // Successful finish
    }
  }

  // MODIFIED: Takes a 'success' flag
  function endGame(success: boolean = false) {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    // Save final score regardless of success
    saveFinalResult()
    gameState.value = success ? 'finished' : 'intro'
  }

  // NEW: Game over logic when time runs out
  function timeUp() {
    if (timerInterval) clearInterval(timerInterval)
    playerStore.applyTimePenalty(3600) // Apply full time penalty
    saveFinalResult()
    localStorage.removeItem('dhl-it-lockdown-state') // Clean up in-progress game

    // Reset stores to initial state
    playerStore.reset()
    roomStore.reset()

    gameState.value = 'intro' // Redirect to intro screen
    alert("Time's up! Your final score has been recorded.")
  }

  // NEW: Helper to save the final game result
  function saveFinalResult() {
    const finalResult = {
      firstName: playerStore.firstName,
      lastName: playerStore.lastName,
      department: playerStore.department,
      score: playerStore.score,
      completed: true,
    }
    localStorage.setItem('dhl-it-lockdown-completed-game', JSON.stringify(finalResult))
  }

  function rehydrate(state: any) {
    gameState.value = state.gameState
    currentRoomIndex.value = state.currentRoomIndex
    startTime.value = state.startTime

    if (gameState.value === 'playing') {
      currentTime.value = Date.now()
      if (timerInterval) clearInterval(timerInterval)
      timerInterval = setInterval(() => {
        currentTime.value = Date.now()
      }, 1000)
    }
  }

  return {
    gameState,
    currentRoom,
    elapsedTime,
    startGame,
    advanceToNextRoom,
    endGame,
    timeUp,
    rehydrate,
    saveFinalResult, // NEW: Expose saveFinalResult function
  }
})
