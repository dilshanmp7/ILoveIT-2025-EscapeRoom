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

  // NEW: A computed property to hold the list of all rooms
  const allRooms = computed(() => ROOM_DATA)

  const currentRoom = computed(() => {
    return ROOM_DATA[currentRoomIndex.value]
  })

  const elapsedTime = computed(() => {
    if (startTime.value === 0) return 0
    // Cap elapsed time at 45 minutes (2700 seconds)
    return Math.min(2700, Math.floor((currentTime.value - startTime.value) / 1000))
  })

  // ADDED: A computed property to format the remaining time for the UI
  const formattedTime = computed(() => {
    const totalGameTime = 2700 // 45 minutes in seconds
    const remainingSeconds = totalGameTime - elapsedTime.value
    if (remainingSeconds <= 0) return '00:00'

    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
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

  function endGame(success: boolean = false) {
    if (timerInterval) {
      clearInterval(timerInterval)
    }

    playerStore.endTiming()
    playerStore.setCompletionBonus(success ? 3 : currentRoomIndex.value)

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

  function timeUp() {
    if (timerInterval) clearInterval(timerInterval)

    playerStore.endTiming()
    playerStore.setCompletionBonus(0)

    console.log('⏰ Time up! Submitting partial score to tournament...')
    playerStore
      .saveToLeaderboard()
      .then((result) => {
        console.log('📊 Timeout score submission result:', result)
      })
      .catch((error) => {
        console.error('❌ Timeout score submission failed:', error)
      })

    localStorage.removeItem('dhl-it-lockdown-state')

    playerStore.reset()
    roomStore.reset()

    gameState.value = 'intro'
    alert(`Time's up! Your final score: ${playerStore.finalScore} points`)
  }

  function saveFinalResult() {
    const finalResult = {
      firstName: playerStore.firstName,
      lastName: playerStore.lastName,
      department: playerStore.department,
      score: playerStore.finalScore,
      timeSpent: playerStore.timeSpent,
      completed: true,
      timestamp: Date.now(),
    }

    const gameId = `dhl-it-lockdown-completed-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`
    localStorage.setItem(gameId, JSON.stringify(finalResult))
    localStorage.setItem('dhl-it-lockdown-completed-game', JSON.stringify(finalResult))
  }

  function rehydrate(state: any) {
    gameState.value = state.gameState
    currentRoomIndex.value = state.currentRoomIndex
    startTime.value = state.startTime
    // Restore currentTime if available, else use Date.now()
    currentTime.value = state.currentTime ? state.currentTime : Date.now()

    if (gameState.value === 'playing') {
      if (timerInterval) clearInterval(timerInterval)
      timerInterval = setInterval(() => {
        currentTime.value += 1000 // Increment by 1 second
      }, 1000)

      const expectedRoomId = ROOM_DATA[currentRoomIndex.value].id
      if (roomStore.currentRoomId !== expectedRoomId) {
        roomStore.setRoomId(expectedRoomId)
      }
    }
  }

  function saveState() {
    const state = {
      gameState: gameState.value,
      currentRoomIndex: currentRoomIndex.value,
      startTime: startTime.value,
      currentTime: currentTime.value,
    }
    localStorage.setItem('escaperoomGameState', JSON.stringify(state))

    if (
      gameState.value === 'playing' &&
      playerStore.firstName &&
      playerStore.lastName &&
      playerStore.department
    ) {
      syncGameProgressToDatabase()
    }
  }

  async function syncGameProgressToDatabase() {
    try {
      await fetch('/api/update-game-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: playerStore.firstName,
          lastName: playerStore.lastName,
          department: playerStore.department,
          currentRoomIndex: currentRoomIndex.value,
          startTime: startTime.value,
          currentTime: currentTime.value,
        }),
      })
      console.log('✅ Game progress synced to database (with timer state)')
    } catch (error) {
      console.warn('⚠️ Failed to sync game progress to database:', error)
    }
  }

  return {
    gameState,
    currentRoom,
    currentRoomIndex,
    startTime,
    elapsedTime,
    formattedTime, // EXPOSED: Make formattedTime available
    allRooms, // EXPOSED: Make allRooms available
    startGame,
    advanceToNextRoom,
    endGame,
    timeUp,
    rehydrate,
    saveState,
    syncGameProgressToDatabase,
    saveFinalResult,
  }
})
