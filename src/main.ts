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

// NEW: Restore state from localStorage on app startup
function restoreState() {
  try {
    console.log('Attempting to restore state from localStorage...')
    const gameState = localStorage.getItem('escaperoomGameState')
    const playerState = localStorage.getItem('escaperoomPlayerState')
    const roomState = localStorage.getItem('escaperoomRoomState')

    console.log('Found gameState in localStorage:', !!gameState)
    console.log('Found playerState in localStorage:', !!playerState)
    console.log('Found roomState in localStorage:', !!roomState)

    const gameStore = useGameStore()
    const playerStore = usePlayerStore()
    const roomStore = useRoomStore()

    // IMPORTANT: Restore room state FIRST before game state
    if (roomState) {
      console.log('Restoring room state first...')
      roomStore.rehydrate(JSON.parse(roomState))
    }

    if (playerState) {
      playerStore.rehydrate(JSON.parse(playerState))
    }

    if (gameState) {
      console.log('Restoring game state:', JSON.parse(gameState))
      gameStore.rehydrate(JSON.parse(gameState))
    }
  } catch (error) {
    console.warn('Failed to restore state from localStorage:', error)
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
    playerStore.saveState()
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
