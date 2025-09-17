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
    class="min-h-screen text-white flex items-center justify-center p-2 mobile:p-4 sm:p-6 laptop:p-8 large:p-10 relative"
    :style="{
      backgroundImage: `url('${dhlLoveIt2025Background}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div
      class="absolute top-2 mobile:top-4 laptop:top-6 large:top-8 left-2 mobile:left-4 laptop:left-6 large:left-8 z-10 hidden lg:block"
    >
      <img
        :src="iLoveItImage"
        alt="I Love IT"
        class="w-12 laptop:w-16 large:w-20 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
    <div
      class="absolute top-2 mobile:top-4 laptop:top-6 large:top-8 right-2 mobile:right-4 laptop:right-6 large:right-8 z-10 hidden lg:block"
    >
      <img
        :src="iLoveItImage"
        alt="I Love IT"
        class="w-12 laptop:w-16 large:w-20 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
    <div
      class="absolute bottom-2 mobile:bottom-4 laptop:bottom-6 large:bottom-8 left-2 mobile:left-4 laptop:left-6 large:left-8 z-10 hidden lg:block"
    >
      <img
        :src="iLoveItImage"
        alt="I Love IT"
        class="w-12 laptop:w-16 large:w-20 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
    <div
      class="absolute bottom-2 mobile:bottom-4 laptop:bottom-6 large:bottom-8 right-2 mobile:right-4 laptop:right-6 large:right-8 z-10 hidden lg:block"
    >
      <img
        :src="iLoveItImage"
        alt="I Love IT"
        class="w-8 mobile:w-10 laptop:w-12 large:w-16 opacity-70 hover:opacity-100 transition-opacity"
      />
    </div>
    <div
      class="absolute top-1 mobile:top-2 left-1/2 transform -translate-x-1/2 z-10 flex lg:hidden gap-2 mobile:gap-3"
    >
      <img :src="iLoveItImage" alt="I Love IT" class="w-6 mobile:w-8 opacity-70" />
    </div>

    <div
      class="max-w-3xl mobile:max-w-4xl sm:max-w-5xl laptop:max-w-6xl large:max-w-7xl w-full mx-auto relative z-20"
    >
      <div class="text-center mb-6 mobile:mb-8 laptop:mb-10">
        <img
          :src="dhlLogo"
          alt="DHL Logo"
          class="h-8 mobile:h-10 sm:h-12 laptop:h-16 large:h-20 mx-auto mb-3 mobile:mb-4 sm:mb-6 laptop:mb-8"
        />
        <h1
          class="text-2xl mobile:text-3xl sm:text-4xl laptop:text-5xl large:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dhl-yellow to-dhl-red mb-3 mobile:mb-4 laptop:mb-5"
        >
          Tournament Leaderboard
        </h1>
        <h2
          class="text-lg mobile:text-xl sm:text-2xl laptop:text-3xl large:text-4xl text-gray-300 mb-3 mobile:mb-4 laptop:mb-5"
        >
          🏆 "The IT Lockdown" Champions
        </h2>

        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-2 mobile:gap-3 laptop:gap-4 mb-4 mobile:mb-6"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-xs mobile:text-sm laptop:text-base text-gray-400">
              {{ error ? 'Offline Mode' : 'Live Updates' }} • Last: {{ lastUpdated }}
            </span>
          </div>
          <button
            @click="refreshLeaderboard"
            :disabled="isLoading"
            class="bg-dhl-yellow text-black px-3 mobile:px-4 laptop:px-5 py-2 mobile:py-2 laptop:py-3 rounded-lg font-bold text-xs mobile:text-sm laptop:text-base hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] mobile:min-h-[48px]"
          >
            {{ isLoading ? '⏳ Updating...' : '🔄 Refresh Now' }}
          </button>
        </div>

        <div
          v-if="error"
          class="bg-orange-900/50 border border-orange-500 rounded-lg p-2 mobile:p-3 laptop:p-4 mb-4 mobile:mb-6 text-orange-200 text-xs mobile:text-sm laptop:text-base"
        >
          ⚠️ {{ error }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mobile:gap-4 sm:gap-6">
          <div class="bg-black/60 border border-dhl-yellow rounded-lg p-3 mobile:p-4 laptop:p-5">
            <div
              class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl font-bold text-dhl-yellow"
            >
              {{ topScore }}
            </div>
            <div class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg">
              Top Score
            </div>
          </div>
          <div class="bg-black/60 border border-dhl-red rounded-lg p-3 mobile:p-4 laptop:p-5">
            <div
              class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl font-bold text-dhl-red"
            >
              {{ averageScore }}
            </div>
            <div class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg">
              Average Score
            </div>
          </div>
          <div class="bg-black/60 border border-gray-600 rounded-lg p-3 mobile:p-4 laptop:p-5">
            <div
              class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl font-bold text-blue-400"
            >
              {{ totalPlayers }}
            </div>
            <div class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg">
              Total Players
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="leaderboardData.length === 0 && !isLoading"
        class="text-center py-8 mobile:py-12 laptop:py-16"
      >
        <div class="text-4xl mobile:text-5xl laptop:text-6xl large:text-7xl mb-3 mobile:mb-4">
          🏆
        </div>
        <h3
          class="text-xl mobile:text-2xl laptop:text-3xl large:text-4xl font-bold text-gray-400 mb-1 mobile:mb-2"
        >
          No Results Yet
        </h3>
        <p class="text-sm mobile:text-base laptop:text-lg large:text-xl text-gray-500">
          Be the first to complete the IT Lockdown challenge!
        </p>
      </div>

      <div
        v-if="isLoading"
        class="text-center py-8 mobile:py-12 laptop:py-16 text-gray-400 text-lg"
      >
        ⏳ Loading Leaderboard...
      </div>

      <div
        v-if="leaderboardData.length > 0 && !isLoading"
        class="bg-black/60 border border-gray-600 rounded-xl overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-dhl-yellow/20 to-dhl-red/20 p-3 mobile:p-4 sm:p-6 laptop:p-8 border-b border-gray-600"
        >
          <h3
            class="text-lg mobile:text-xl sm:text-2xl laptop:text-3xl large:text-4xl font-bold text-dhl-yellow text-center mb-4 mobile:mb-6 laptop:mb-8"
          >
            🏆 Prize Winners 🏆
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mobile:gap-3 sm:gap-4 laptop:gap-6">
            <div
              v-for="(entry, index) in leaderboardData.slice(0, 3)"
              :key="index"
              class="bg-black/60 border border-gray-500 rounded-lg p-3 mobile:p-4 laptop:p-5 text-center"
            >
              <div class="text-2xl mobile:text-3xl laptop:text-4xl large:text-5xl mb-1 mobile:mb-2">
                {{ getRankBadge(index) }}
              </div>
              <div class="font-bold text-sm mobile:text-base sm:text-lg laptop:text-xl">
                {{ entry.firstName }} {{ entry.lastName }}
              </div>
              <div class="text-gray-400 text-xs mobile:text-sm laptop:text-base">
                {{ entry.department }}
              </div>
              <div
                class="text-xl mobile:text-2xl laptop:text-3xl large:text-4xl font-bold text-dhl-yellow mt-1 mobile:mt-2"
              >
                {{ entry.score }}
              </div>
              <div class="text-gray-400 text-xs mobile:text-sm laptop:text-base">
                {{ entry.timeSpent }}
              </div>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-800 border-b border-gray-600">
              <tr class="text-left">
                <th
                  class="p-2 mobile:p-3 sm:p-4 font-bold text-dhl-yellow text-xs mobile:text-sm laptop:text-base"
                >
                  Rank
                </th>
                <th
                  class="p-2 mobile:p-3 sm:p-4 font-bold text-dhl-yellow text-xs mobile:text-sm laptop:text-base"
                >
                  Player
                </th>
                <th
                  class="p-2 mobile:p-3 sm:p-4 font-bold text-dhl-yellow text-xs mobile:text-sm laptop:text-base hidden sm:table-cell"
                >
                  Department
                </th>
                <th
                  class="p-2 mobile:p-3 sm:p-4 font-bold text-dhl-yellow text-center text-xs mobile:text-sm laptop:text-base"
                >
                  Score
                </th>
                <th
                  class="p-2 mobile:p-3 sm:p-4 font-bold text-dhl-yellow text-center text-xs mobile:text-sm laptop:text-base"
                >
                  Time
                </th>
                <th
                  class="p-2 mobile:p-3 sm:p-4 font-bold text-dhl-yellow text-center text-xs mobile:text-sm laptop:text-base hidden sm:table-cell"
                >
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, index) in leaderboardData"
                :key="index"
                class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <td class="p-2 mobile:p-3 sm:p-4">
                  <span
                    class="inline-block px-2 mobile:px-3 py-1 rounded-full text-xs mobile:text-sm font-bold"
                    :class="getRankClass(index)"
                  >
                    {{ getRankBadge(index) }}
                  </span>
                </td>
                <td class="p-2 mobile:p-3 sm:p-4">
                  <div class="font-semibold text-xs mobile:text-sm laptop:text-base">
                    {{ entry.firstName }} {{ entry.lastName }}
                  </div>
                  <div class="text-xs mobile:text-xs laptop:text-sm text-gray-400">
                    {{ entry.workTime }}
                  </div>
                  <div class="text-xs mobile:text-xs laptop:text-sm text-gray-400 sm:hidden">
                    {{ entry.department }}
                  </div>
                </td>
                <td
                  class="p-2 mobile:p-3 sm:p-4 text-gray-300 text-xs mobile:text-sm laptop:text-base hidden sm:table-cell"
                >
                  {{ entry.department }}
                </td>
                <td class="p-2 mobile:p-3 sm:p-4 text-center">
                  <div
                    class="text-lg mobile:text-xl laptop:text-2xl large:text-3xl font-bold text-dhl-yellow"
                  >
                    {{ entry.score }}
                  </div>
                </td>
                <td
                  class="p-2 mobile:p-3 sm:p-4 text-center text-blue-400 font-mono text-xs mobile:text-sm laptop:text-base"
                >
                  {{ entry.timeSpent }}
                </td>
                <td class="p-2 mobile:p-3 sm:p-4 text-center hidden sm:table-cell">
                  <div class="text-xs mobile:text-sm laptop:text-base text-gray-400">
                    {{ new Date(entry.timestamp).toLocaleDateString() }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="text-center mt-6 mobile:mt-8 laptop:mt-10">
        <button
          @click="goBack"
          class="bg-dhl-red text-white px-6 mobile:px-8 laptop:px-10 py-2 mobile:py-3 laptop:py-4 rounded-lg font-bold text-sm mobile:text-base laptop:text-lg hover:bg-red-600 transition-colors touch-manipulation min-h-[44px] mobile:min-h-[48px]"
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
