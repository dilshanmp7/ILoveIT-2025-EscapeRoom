import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ROOM_DATA } from '@/gameData'
import { useRoomStore } from './roomStore'

export const useGameStore = defineStore('game', () => {
  const gameState = ref<'intro' | 'playing' | 'paused' | 'finished'>('intro')
  const currentRoomIndex = ref<number>(0)
  const startTime = ref<number>(0)
  const currentTime = ref<number>(0)
  let timerInterval: ReturnType<typeof setInterval> | null = null

  const roomStore = useRoomStore()

  const currentRoom = computed(() => {
    return ROOM_DATA[currentRoomIndex.value]
  })

  const elapsedTime = computed(() => {
    if (startTime.value === 0) return 0
    return Math.floor((currentTime.value - startTime.value) / 1000)
  })

  function startGame() {
    roomStore.setupRoom(ROOM_DATA[0].id)
    currentRoomIndex.value = 0
    startTime.value = Date.now()
    currentTime.value = Date.now()
    timerInterval = setInterval(() => {
      currentTime.value = Date.now()
    }, 1000)
    gameState.value = 'playing'
  }

  function advanceToNextRoom() {
    if (currentRoomIndex.value < ROOM_DATA.length - 1) {
      currentRoomIndex.value++
      roomStore.setupRoom(currentRoom.value.id)
    } else {
      endGame()
    }
  }

  function endGame() {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    gameState.value = 'finished'
  }

  return {
    gameState,
    currentRoom,
    elapsedTime,
    startGame,
    advanceToNextRoom,
    endGame,
  }
})
