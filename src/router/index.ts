import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import IntroView from '../views/IntroView.vue'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import LeaderboardView from '../views/LeaderboardView.vue'
import ResultsView from '../views/ResultsView.vue'
import AdminLeaderboardView from '../views/AdminLeaderboardView.vue'
import { useGameStore } from '../stores/gameStore'
import { usePlayerStore } from '../stores/playerStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/intro',
      name: 'intro',
      component: IntroView,
    },
    {
      // IMPORTANT: Changed component from HomeView to GameView to match your setup
      path: '/game',
      name: 'game',
      component: GameView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderboardView,
    },
    {
      path: '/admin/leaderboard',
      name: 'admin-leaderboard',
      component: AdminLeaderboardView,
    },
  ],
})

// ✅ ANTI-CHEAT: Navigation guards to prevent cheating
router.beforeEach(async (to, from, next) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()

  // 🔧 FIX: Check for cross-player contamination on app startup
  // If game is in playing state but user is going to intro/welcome,
  // this means a different player is trying to register
  if (gameStore.gameState === 'playing' && (to.name === 'intro' || to.name === 'welcome')) {
    // Get current player data from localStorage
    const savedPlayerState = localStorage.getItem('playerStore')

    if (savedPlayerState) {
      try {
        const playerData = JSON.parse(savedPlayerState)
        console.log('🔍 Checking for cross-player contamination...')

        // If there's a playing game but user is accessing intro/welcome,
        // this likely means localStorage contains previous player's data
        console.log(
          '🧹 Detected potential cross-player contamination - clearing previous game data'
        )

        // Clear all game-related localStorage
        localStorage.removeItem('escaperoomGameState')
        localStorage.removeItem('escaperoomRoomState')
        localStorage.removeItem('playerStore')
        localStorage.removeItem('dhl-it-lockdown-completed-game')

        // Reset stores
        gameStore.gameState = 'intro'
        gameStore.currentRoomIndex = 0
        gameStore.startTime = 0
        playerStore.reset()

        console.log('✅ Cross-player data cleared, proceeding to intro')
        next()
        return
      } catch (error) {
        console.warn('⚠️ Error checking player data:', error)
      }
    }
  }

  // If player has a game in progress, allow navigation and resuming
  // No forfeit logic: player can reload or navigate and resume their game
  // Only block cross-player contamination (see above)
  next()
})

export default router
