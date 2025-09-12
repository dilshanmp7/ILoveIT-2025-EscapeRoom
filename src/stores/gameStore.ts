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
    // Cap elapsed time at 45 minutes (2700 seconds)
    return Math.min(2700, Math.floor((currentTime.value - startTime.value) / 1000))
  })

  function startGame() {
    console.log('startGame function called')
    console.log('Current gameState before:', gameState.value)

    roomStore.setupRoom(ROOM_DATA[0].id)
    currentRoomIndex.value = 0
    startTime.value = Date.now()
    currentTime.value = Date.now()

    // Start player timing
    playerStore.startTiming()

    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      currentTime.value = Date.now()
    }, 1000)
    gameState.value = 'playing'

    console.log('gameState after:', gameState.value)
    console.log('startTime set to:', startTime.value)

    // Save the initial game state
    saveState()
  }

  function advanceToNextRoom() {
    if (currentRoomIndex.value < ROOM_DATA.length - 1) {
      console.log(
        'Advancing from room index:',
        currentRoomIndex.value,
        'to:',
        currentRoomIndex.value + 1
      )
      currentRoomIndex.value++
      roomStore.setupRoom(currentRoom.value.id)
      // Save the state after advancing to next room
      saveState()
      console.log('Room advanced and state saved. New room:', currentRoom.value.name)
    } else {
      endGame(true) // Successful finish
    }
  }

  // MODIFIED: Takes a 'success' flag
  function endGame(success: boolean = false) {
    if (timerInterval) {
      clearInterval(timerInterval)
    }

    // End player timing and set completion bonus
    playerStore.endTiming()
    playerStore.setCompletionBonus(success ? 3 : currentRoomIndex.value)

    // Save to leaderboard if successful
    if (success) {
      console.log('🎯 Game completed successfully! Submitting score to tournament...')
      playerStore
        .saveToLeaderboard()
        .then((result) => {
          console.log('📊 Score submission result:', result)
          if (result.submittedToCentral) {
            console.log('✅ Successfully submitted to central tournament database')
          } else {
            console.log('📱 Score saved locally, tournament sync pending')
          }
        })
        .catch((error) => {
          console.error('❌ Score submission failed:', error)
        })
    }

    gameState.value = success ? 'finished' : 'intro'
  }

  // NEW: Game over logic when time runs out
  function timeUp() {
    if (timerInterval) clearInterval(timerInterval)

    // End timing and save result
    playerStore.endTiming()
    playerStore.setCompletionBonus(0) // No bonus for timeout

    console.log('⏰ Time up! Submitting partial score to tournament...')
    playerStore
      .saveToLeaderboard()
      .then((result) => {
        console.log('📊 Timeout score submission result:', result)
      })
      .catch((error) => {
        console.error('❌ Timeout score submission failed:', error)
      })

    localStorage.removeItem('dhl-it-lockdown-state') // Clean up in-progress game

    // Reset stores to initial state
    playerStore.reset()
    roomStore.reset()

    gameState.value = 'intro' // Redirect to intro screen
    alert(`Time's up! Your final score: ${playerStore.finalScore} points`)
  }

  // NEW: Helper to save the final game result
  function saveFinalResult() {
    const finalResult = {
      firstName: playerStore.firstName,
      lastName: playerStore.lastName,
      department: playerStore.department,
      score: playerStore.finalScore,
      timeSpent: playerStore.timeSpent,
      completed: true,
      timestamp: Date.now(), // Add timestamp for better tracking
    }

    // Save individual completed game with unique identifier
    const gameId = `dhl-it-lockdown-completed-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`
    localStorage.setItem(gameId, JSON.stringify(finalResult))

    // Also keep the single completed game for replay prevention
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

      // Only fix room ID if there's a mismatch, but don't call setupRoom
      // which would reset all progress. The roomStore should already be restored.
      const expectedRoomId = ROOM_DATA[currentRoomIndex.value].id
      if (roomStore.currentRoomId !== expectedRoomId) {
        console.log(
          'Room mismatch detected. Expected:',
          expectedRoomId,
          'Got:',
          roomStore.currentRoomId
        )
        console.log('Setting currentRoomId without resetting progress...')
        // Just set the room ID without calling setupRoom to preserve restored state
        roomStore.setRoomId(expectedRoomId)
      } else {
        console.log('Room correctly set:', roomStore.currentRoomId)
      }
    }
  }

  function saveState() {
    const state = {
      gameState: gameState.value,
      currentRoomIndex: currentRoomIndex.value,
      startTime: startTime.value,
    }
    console.log('Saving game state:', state)
    localStorage.setItem('escaperoomGameState', JSON.stringify(state))
  }

  return {
    gameState,
    currentRoom,
    currentRoomIndex,
    elapsedTime,
    startGame,
    advanceToNextRoom,
    endGame,
    timeUp,
    rehydrate,
    saveState,
    saveFinalResult, // NEW: Expose saveFinalResult function
  }
})
