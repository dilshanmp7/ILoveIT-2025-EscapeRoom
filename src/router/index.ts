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

  // If player has a game in progress, restrict navigation
  if (gameStore.gameState === 'playing') {
    // Allow navigation within game (results page when finishing)
    if (to.name === 'results' || to.name === 'home') {
      next()
      return
    }

    // Block navigation to intro/welcome to prevent re-registration
    if (to.name === 'intro' || to.name === 'welcome') {
      const confirmLeave = confirm(
        'You have a game in progress. Leaving will forfeit your current attempt. Are you sure?'
      )

      if (confirmLeave) {
        // Reset game state and allow navigation
        gameStore.endGame(false)
        playerStore.reset()
        next()
      } else {
        // Stay on current page
        next(false)
      }
      return
    }

    // Allow other navigation (leaderboard, admin, etc.)
    next()
  } else {
    // No game in progress, allow all navigation
    next()
  }
})

export default router
