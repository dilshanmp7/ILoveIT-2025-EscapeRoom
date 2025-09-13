import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useGameStore } from './stores/gameStore'
import { usePlayerStore } from './stores/playerStore'
import { useRoomStore } from './stores/roomStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// NEW: Smart state restoration that validates player identity
function restoreState() {
  try {
    console.log('Attempting to restore state from localStorage...')
    const gameState = localStorage.getItem('escaperoomGameState')
    const playerState = localStorage.getItem('playerStore')
    const roomState = localStorage.getItem('escaperoomRoomState')

    console.log('Found gameState in localStorage:', !!gameState)
    console.log('Found playerState in localStorage:', !!playerState)
    console.log('Found roomState in localStorage:', !!roomState)

    // 🔧 FIX: Only restore if we have complete player identity
    // This prevents restoring previous player's state before checking current user
    if (!gameState || !playerState) {
      console.log('⚠️ Incomplete state data - skipping restoration')
      return
    }

    const parsedGameState = JSON.parse(gameState)
    const parsedPlayerState = JSON.parse(playerState)

    // 🔧 FIX: Only restore if player has valid identity data
    // This ensures we don't restore anonymous/incomplete sessions
    if (!parsedPlayerState.firstName || !parsedPlayerState.lastName) {
      console.log('⚠️ No player identity found - clearing old state')
      localStorage.removeItem('escaperoomGameState')
      localStorage.removeItem('playerStore')
      localStorage.removeItem('escaperoomRoomState')
      return
    }

    // 🔧 FIX: Only restore "playing" games, not "intro" or "finished"
    // This prevents restoring completed or invalid game states
    if (parsedGameState.gameState !== 'playing') {
      console.log('⚠️ Game not in playing state - skipping restoration')
      return
    }

    console.log('✅ Valid game state found - proceeding with restoration')

    const gameStore = useGameStore()
    const playerStore = usePlayerStore()
    const roomStore = useRoomStore()

    // IMPORTANT: Restore room state FIRST before game state
    if (roomState) {
      console.log('Restoring room state first...')
      roomStore.rehydrate(JSON.parse(roomState))
    }

    console.log('Restoring player state...')
    playerStore.rehydrate()

    console.log('Restoring game state:', parsedGameState)
    gameStore.rehydrate(parsedGameState)
  } catch (error) {
    console.warn('Failed to restore state from localStorage:', error)
    // Clear corrupted data
    localStorage.removeItem('escaperoomGameState')
    localStorage.removeItem('playerStore')
    localStorage.removeItem('escaperoomRoomState')
  }
}

// NEW: Set up automatic state saving
function setupStatePersistence() {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const roomStore = useRoomStore()

  // Save game state whenever it changes
  gameStore.$subscribe(() => {
    gameStore.saveState()
  })

  // Save player state whenever it changes
  playerStore.$subscribe(() => {
    playerStore.persist()
  })

  // Save room state whenever it changes
  roomStore.$subscribe(() => {
    roomStore.saveState()
  })
}

// Restore state after pinia is initialized
restoreState()
setupStatePersistence()

app.mount('#app')
