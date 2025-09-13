import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import IntroView from '../views/IntroView.vue'
import HomeView from '../views/HomeView.vue'
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
      path: '/game',
      name: 'home',
      component: HomeView,
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

  // If player has a game in progress, restrict navigation
  if (gameStore.gameState === 'playing') {
    // Allow navigation to results when game finishes
    if (to.name === 'results') {
      next()
      return
    }

    // Allow navigation to leaderboard and admin pages during game
    if (to.name === 'leaderboard' || to.name?.toString().startsWith('admin')) {
      next()
      return
    }

    // Block navigation to intro/welcome/home to prevent re-registration
    if (to.name === 'intro' || to.name === 'welcome' || to.name === 'home') {
      const confirmLeave = confirm(
        'You have a game in progress. Leaving will forfeit your current attempt and submit your current score. You cannot restart. Are you sure?'
      )

      if (confirmLeave) {
        // ✅ ANTI-CHEAT: Submit current progress as final score to prevent cheating
        console.log('🚫 User forfeiting game - submitting current progress to prevent restart')

        try {
          // Force submit current score to database to mark as completed
          // Note: This prevents the player from restarting even if they forfeit
          await playerStore.saveToLeaderboard()
          console.log('✅ Forfeit score submitted to database - player cannot restart')
        } catch (error) {
          console.error('❌ Failed to submit forfeit score:', error)
          // Even if submission fails, still prevent restart by resetting local state
        }

        // End game with forfeit flag and reset local state
        gameStore.endGame(false) // false = not a natural completion
        playerStore.reset()

        // Navigate to results to show their submitted score
        if (to.name === 'intro') {
          // If going to intro, redirect to leaderboard instead to show results
          next({ name: 'leaderboard', replace: true })
        } else {
          next()
        }
      } else {
        // User wants to stay - prevent navigation (stay in game)
        next(false)
      }
      return
    }

    // Block other navigation during game
    next(false)
  } else {
    // No game in progress, allow all navigation
    next()
  }
})

export default router
