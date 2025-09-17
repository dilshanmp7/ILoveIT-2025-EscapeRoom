<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import dhlLogo from '@/assets/dhl_logo2.png'
import dhlLoveIt2025Background from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'
import iLoveItImage from '@/assets/IloveIT.png'

interface LeaderboardEntry {
  firstName: string
  lastName: string
  department: string
  workTime: string
  score: number
  timeSpent: string
  timestamp: number
  rank: number
  playerId: string
}

const router = useRouter()
const leaderboardData = ref<LeaderboardEntry[]>([])
const isLoading = ref(true)
const error = ref('')
const lastUpdated = ref('')
const tournamentStats = ref({
  totalPlayers: 0,
  topScore: 0,
  averageScore: 0,
})

let refreshInterval: ReturnType<typeof setInterval> | null = null

// ✅ REAL-TIME LEADERBOARD - Load from backend with live updates
async function loadLeaderboard(retryCount = 1, maxRetries = 3) {
  const retryDelay = 2000 // 2 seconds between retries

  try {
    console.log(
      `🔄 Fetching leaderboard from production database (attempt ${retryCount}/${maxRetries})`
    )
    isLoading.value = true
    error.value = ''

    const response = await fetch('/api/leaderboard?limit=50', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    console.log('📡 API Response received:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log('� Raw response (first 200 chars):', responseText.substring(0, 200))

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error(`API returned non-JSON response: ${responseText.substring(0, 100)}...`)
    }

    if (data.success && data.leaderboard) {
      leaderboardData.value = data.leaderboard
      tournamentStats.value = {
        totalPlayers: data.totalPlayers || 0,
        topScore: data.topScore || 0,
        averageScore: data.averageScore || 0,
      }
      lastUpdated.value = new Date().toLocaleTimeString()
      console.log('✅ Production leaderboard loaded:', data.leaderboard.length, 'players')
    } else {
      throw new Error(data.error || 'No leaderboard data received from production database')
    }
  } catch (fetchError: any) {
    console.error('❌ Production database fetch failed:', fetchError)

    if (
      fetchError?.code === 'ETIMEDOUT' ||
      fetchError?.message?.includes('timeout') ||
      fetchError?.message?.includes('ETIMEDOUT')
    ) {
      error.value = '⏱️ Production database timeout. Please try again.'
    } else if (
      fetchError?.message?.includes('Failed to fetch') ||
      fetchError?.message?.includes('NetworkError')
    ) {
      error.value = '🌐 Network connection failed. Please check your internet connection.'
    } else if (fetchError?.message?.includes('HTTP 5')) {
      error.value = '🔧 Production database is temporarily unavailable.'
    } else {
      error.value = `⚠️ Production database error: ${fetchError.message || 'Unknown error'}`
    }

    console.log(
      `⏳ Retrying production database connection in ${
        retryDelay / 1000
      }s... (${retryCount}/${maxRetries})`
    )

    if (retryCount < maxRetries) {
      setTimeout(() => {
        loadLeaderboard(retryCount + 1, maxRetries)
      }, retryDelay)
      return
    }

    // After all retries failed, show error - no fallback data
    console.log('❌ All production database connection attempts failed')
    leaderboardData.value = []
    tournamentStats.value = { totalPlayers: 0, topScore: 0, averageScore: 0 }
  } finally {
    isLoading.value = false
  }
}

// 🔄 Refresh leaderboard data
async function refreshLeaderboard() {
  console.log('🔄 Manual refresh requested')
  await loadLeaderboard()
}

// 🏅 Get rank badge emoji
function getRankBadge(index: number): string {
  switch (index) {
    case 0:
      return '🥇'
    case 1:
      return '🥈'
    case 2:
      return '🥉'
    default:
      return '🏅'
  }
}

// 🎨 Get rank styling class
function getRankClass(index: number): string {
  switch (index) {
    case 0:
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900'
    case 1:
      return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900'
    case 2:
      return 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900'
    default:
      return 'bg-gradient-to-br from-blue-400 to-blue-600 text-blue-900'
  }
}

// 🔙 Navigation back to game
function goBack() {
  router.push('/game')
}

// ✅ PRODUCTION DATABASE LIVE TRACKING - Auto-refresh every 30 seconds
onMounted(() => {
  console.log('🏆 LeaderboardView mounted - connecting to production database')
  loadLeaderboard()

  // Enable auto-refresh for live tournament tracking from production database
  refreshInterval = setInterval(() => {
    console.log('⏰ Auto-refreshing leaderboard from production database')
    loadLeaderboard()
  }, 30000) // Refresh every 30 seconds
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// Computed properties for display
const topScore = computed(() => tournamentStats.value.topScore)
const averageScore = computed(() => tournamentStats.value.averageScore)
const totalPlayers = computed(() => tournamentStats.value.totalPlayers)
</script>

<template>
  <div
    class="h-screen text-white flex items-center justify-center p-2 sm:p-4 relative overflow-hidden"
    :style="{
      backgroundImage: `url('${dhlLoveIt2025Background}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div class="absolute top-2 left-2 z-10 hidden lg:block"></div>
    <div class="absolute top-2 right-2 z-10 hidden lg:block"></div>
    <div class="absolute bottom-2 left-2 z-10 hidden lg:block"></div>
    <div class="absolute bottom-2 right-2 z-10 hidden lg:block"></div>
    <div class="absolute top-1 left-1/2 transform -translate-x-1/2 z-10 flex lg:hidden"></div>

    <div
      class="max-w-3xl mobile:max-w-4xl sm:max-w-5xl laptop:max-w-6xl large:max-w-7xl w-full mx-auto relative z-20 flex flex-col max-h-[95vh]"
    >
      <div class="text-center mb-4 sm:mb-6 laptop:mb-8 flex-shrink-0">
        <img :src="dhlLogo" alt="DHL Logo" class="h-8 sm:h-12 mx-auto mb-3" />
        <h1
          class="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dhl-yellow to-dhl-red mb-2"
        >
          Tournament Leaderboard
        </h1>
        <h2 class="text-lg sm:text-2xl text-gray-300 mb-3">🏆 "The IT Lockdown" Champions</h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div class="bg-black/60 border border-dhl-yellow rounded-lg p-3">
            <div class="text-xl sm:text-3xl font-bold text-dhl-yellow">{{ topScore }}</div>
            <div class="text-gray-300 text-xs sm:text-base">Top Score</div>
          </div>
          <div class="bg-black/60 border border-dhl-red rounded-lg p-3">
            <div class="text-xl sm:text-3xl font-bold text-dhl-red">{{ averageScore }}</div>
            <div class="text-gray-300 text-xs sm:text-base">Average Score</div>
          </div>
          <div class="bg-black/60 border border-gray-600 rounded-lg p-3">
            <div class="text-xl sm:text-3xl font-bold text-blue-400">{{ totalPlayers }}</div>
            <div class="text-gray-300 text-xs sm:text-base">Total Players</div>
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="text-center py-8 text-gray-400 text-lg">
          ⏳ Loading Leaderboard...
        </div>

        <div v-if="leaderboardData.length === 0 && !isLoading" class="text-center py-8">
          <div class="text-4xl mb-3">🏆</div>
          <h3 class="text-xl font-bold text-gray-400 mb-1">No Results Yet</h3>
          <p class="text-sm text-gray-500">Be the first to complete the challenge!</p>
        </div>

        <div
          v-if="leaderboardData.length > 0 && !isLoading"
          class="bg-black/60 border border-gray-600 rounded-xl overflow-hidden"
        >
          <div
            class="bg-gradient-to-r from-dhl-yellow/20 to-dhl-red/20 p-3 sm:p-6 border-b border-gray-600"
          >
            <h3 class="text-lg sm:text-2xl font-bold text-dhl-yellow text-center mb-4">
              🏆 Winners 🏆
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
              <div
                v-for="(entry, index) in leaderboardData.slice(0, 3)"
                :key="index"
                class="bg-black/60 border border-gray-500 rounded-lg p-3 text-center"
              >
                <div class="text-2xl mb-1">{{ getRankBadge(index) }}</div>
                <div class="font-bold text-sm sm:text-lg">
                  {{ entry.firstName }} {{ entry.lastName }}
                </div>
                <div class="text-gray-400 text-xs sm:text-sm">{{ entry.department }}</div>
                <div class="text-xl sm:text-3xl font-bold text-dhl-yellow mt-1">
                  {{ entry.score }}
                </div>
                <div class="text-gray-400 text-xs sm:text-sm">{{ entry.timeSpent }}</div>
              </div>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-800 border-b border-gray-600 sticky top-0 z-10">
                <tr class="text-left">
                  <th class="p-2 sm:p-4 font-bold text-dhl-yellow text-xs sm:text-base">Rank</th>
                  <th class="p-2 sm:p-4 font-bold text-dhl-yellow text-xs sm:text-base">Player</th>
                  <th
                    class="p-2 sm:p-4 font-bold text-dhl-yellow text-xs sm:text-base hidden sm:table-cell"
                  >
                    Dept.
                  </th>
                  <th class="p-2 sm:p-4 font-bold text-dhl-yellow text-center text-xs sm:text-base">
                    Score
                  </th>
                  <th class="p-2 sm:p-4 font-bold text-dhl-yellow text-center text-xs sm:text-base">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(entry, index) in leaderboardData"
                  :key="index"
                  class="border-b border-gray-700 hover:bg-gray-800/50"
                >
                  <td class="p-2 sm:p-4">
                    <span
                      class="inline-block px-2 py-1 rounded-full text-xs sm:text-sm font-bold"
                      :class="getRankClass(index)"
                    >
                      {{ getRankBadge(index) }}
                    </span>
                  </td>
                  <td class="p-2 sm:p-4">
                    <div class="font-semibold text-xs sm:text-base">
                      {{ entry.firstName }} {{ entry.lastName }}
                    </div>
                    <div class="text-xs text-gray-400 sm:hidden">{{ entry.department }}</div>
                  </td>
                  <td class="p-2 sm:p-4 text-gray-300 text-xs sm:text-base hidden sm:table-cell">
                    {{ entry.department }}
                  </td>
                  <td class="p-2 sm:p-4 text-center">
                    <div class="text-lg sm:text-2xl font-bold text-dhl-yellow">
                      {{ entry.score }}
                    </div>
                  </td>
                  <td class="p-2 sm:p-4 text-center text-blue-400 font-mono text-xs sm:text-base">
                    {{ entry.timeSpent }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="text-center mt-6 flex-shrink-0">
        <button
          @click="goBack"
          class="bg-dhl-red text-white px-6 sm:px-10 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg hover:bg-red-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
