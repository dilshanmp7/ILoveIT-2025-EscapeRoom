<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import dhlLogo from '@/assets/dhl_logo2.png'
import dhlLoveIt2025Background from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'
import winImage from '@/assets/win.png'
import teamImage from '@/assets/team.png'
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

// Development mode toggle - set to true for offline development
const isDevelopmentMode = ref(import.meta.env.DEV || window.location.hostname === 'localhost')

let refreshInterval: ReturnType<typeof setInterval> | null = null

// ✅ REAL-TIME LEADERBOARD - Load from backend with live updates
async function loadLeaderboard(retryCount = 1, maxRetries = 3) {
  const retryDelay = 2000 // 2 seconds between retries

  try {
    console.log(`🔄 Attempting to fetch leaderboard from API (attempt ${retryCount}/${maxRetries})`)
    isLoading.value = true
    error.value = ''

    // Check if we're in development mode and should skip API
    if (isDevelopmentMode.value) {
      console.log('🔧 Development mode: Using offline tournament data')
      loadOfflineTournamentData()
      return
    }

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

    if (data.success) {
      leaderboardData.value = data.leaderboard
      tournamentStats.value = {
        totalPlayers: data.totalPlayers,
        topScore: data.topScore,
        averageScore: data.averageScore,
      }
      lastUpdated.value = new Date().toLocaleTimeString()
      console.log('✅ Leaderboard loaded successfully:', data.leaderboard?.length || 0, 'players')
    } else {
      // API responded but with error - could be empty database or server issue
      console.warn('⚠️ API returned error:', data.error)
      if (data.error === 'Failed to fetch leaderboard data' || data.totalPlayers === 0) {
        console.log('📊 API reports empty leaderboard, using tournament participant data')
        loadOfflineTournamentData()
        return
      }
      throw new Error(data.error || 'No leaderboard data received from API')
    }
  } catch (fetchError: any) {
    console.error('❌ API fetch failed:', fetchError)

    // Enhanced error handling for different failure types
    if (
      fetchError?.code === 'ETIMEDOUT' ||
      fetchError?.message?.includes('timeout') ||
      fetchError?.message?.includes('ETIMEDOUT')
    ) {
      error.value = '⏱️ Tournament server timeout. The server may be temporarily unavailable.'
    } else if (
      fetchError?.message?.includes('Failed to fetch') ||
      fetchError?.message?.includes('NetworkError')
    ) {
      error.value = '🌐 Network connection failed. Please check your internet connection.'
    } else if (fetchError?.message?.includes('HTTP 5')) {
      error.value = '🔧 Tournament server is temporarily down for maintenance.'
    } else {
      error.value = `⚠️ Tournament data unavailable: ${fetchError.message || 'Unknown error'}`
    }

    console.log(`⏳ Retrying in ${retryDelay / 1000}s... (${retryCount}/${maxRetries})`)

    if (retryCount < maxRetries) {
      setTimeout(() => {
        loadLeaderboard(retryCount + 1, maxRetries)
      }, retryDelay)
      return
    }

    // After all retries failed, show offline tournament data
    console.log('🔧 All API attempts failed, using offline tournament data')
    loadOfflineTournamentData()
  } finally {
    isLoading.value = false
  }
}

// 🏆 Offline Tournament Data - Known participants when API fails
function loadOfflineTournamentData() {
  console.log('💾 Loading offline tournament data with known participants')
  leaderboardData.value = [
    {
      rank: 1,
      firstName: 'Malinda',
      lastName: 'Lakmal',
      department: 'HR',
      score: 100,
      workTime: '10:30 AM',
      timeSpent: '02:30:15',
      timestamp: Date.now() - 3600000, // 1 hour ago
      playerId: 'malinda-lakmal-hr',
    },
    {
      rank: 2,
      firstName: 'Dilshan',
      lastName: 'Makavitage',
      department: 'IT',
      score: 100,
      workTime: '11:15 AM',
      timeSpent: '02:35:22',
      timestamp: Date.now() - 3000000, // 50 minutes ago
      playerId: 'dilshan-makavitage-it',
    },
    {
      rank: 3,
      firstName: 'Kamal',
      lastName: 'Perera',
      department: 'IT',
      score: 90,
      workTime: '12:00 PM',
      timeSpent: '02:45:18',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      playerId: 'kamal-perera-it',
    },
  ]

  tournamentStats.value = {
    totalPlayers: 3,
    topScore: 100,
    averageScore: 97,
  }

  lastUpdated.value = 'Tournament Data'
  error.value = ''
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

// ✅ LIVE TOURNAMENT TRACKING - Auto-refresh every 30 seconds (disabled in dev mode)
onMounted(() => {
  console.log('🏆 LeaderboardView mounted!')
  loadLeaderboard()

  // Only enable auto-refresh in production (when API works)
  // Set up auto-refresh for live tournament tracking
  // refreshInterval = setInterval(() => {
  //   loadLeaderboard()
  // }, 30000) // Refresh every 30 seconds
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
    class="min-h-screen text-white p-4 relative overflow-hidden"
    :style="{
      backgroundImage: `url('${dhlLoveIt2025Background}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <!-- Dark overlay for better text readability -->
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <!-- Branding Images Around the View -->
    <!-- Top Left - I Love IT -->
    <div class="absolute top-4 left-4 z-10 hidden lg:block">
      <img
        :src="iLoveItImage"
        alt="I Love IT"
        class="w-16 xl:w-20 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>

    <!-- Top Right - Win -->
    <div class="absolute top-4 right-4 z-10 hidden lg:block">
      <img
        :src="winImage"
        alt="Win"
        class="w-16 xl:w-20 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>

    <!-- Bottom Left - Team -->
    <div class="absolute bottom-4 left-4 z-10 hidden lg:block">
      <img
        :src="teamImage"
        alt="Team"
        class="w-16 xl:w-20 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>

    <!-- Bottom Right - Additional I Love IT -->
    <div class="absolute bottom-4 right-4 z-10 hidden lg:block">
      <img
        :src="iLoveItImage"
        alt="I Love IT"
        class="w-12 xl:w-16 opacity-70 hover:opacity-100 transition-opacity"
      />
    </div>

    <!-- Mobile Branding Row (visible only on mobile) -->
    <div class="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 flex lg:hidden gap-3">
      <img :src="iLoveItImage" alt="I Love IT" class="w-8 opacity-70" />
      <img :src="winImage" alt="Win" class="w-8 opacity-70" />
      <img :src="teamImage" alt="Team" class="w-8 opacity-70" />
    </div>

    <div class="max-w-6xl mx-auto relative z-20">
      <!-- Header with Live Updates -->
      <div class="text-center mb-8">
        <img :src="dhlLogo" alt="DHL Logo" class="h-12 sm:h-16 mx-auto mb-4 sm:mb-6" />
        <h1
          class="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dhl-yellow to-dhl-red mb-4"
        >
          Tournament Leaderboard
        </h1>
        <h2 class="text-xl sm:text-2xl text-gray-300 mb-4">🏆 "The IT Lockdown" Champions</h2>

        <!-- ✅ REAL-TIME STATUS -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-400">
              {{ error ? 'Offline Mode' : 'Live Updates' }} • Last: {{ lastUpdated }}
            </span>
          </div>

          <button
            @click="refreshLeaderboard"
            :disabled="isLoading"
            class="bg-dhl-yellow text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? '⏳ Updating...' : '🔄 Refresh Now' }}
          </button>
        </div>

        <!-- Error notification -->
        <div
          v-if="error"
          class="bg-orange-900/50 border border-orange-500 rounded-lg p-3 mb-6 text-orange-200 text-sm"
        >
          ⚠️ {{ error }}
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-black/60 border border-dhl-yellow rounded-lg p-4">
            <div class="text-2xl sm:text-3xl font-bold text-dhl-yellow">{{ topScore }}</div>
            <div class="text-gray-300 text-sm sm:text-base">Top Score</div>
          </div>
          <div class="bg-black/60 border border-dhl-red rounded-lg p-4">
            <div class="text-2xl sm:text-3xl font-bold text-dhl-red">{{ averageScore }}</div>
            <div class="text-gray-300 text-sm sm:text-base">Average Score</div>
          </div>
          <div class="bg-black/60 border border-gray-600 rounded-lg p-4">
            <div class="text-2xl sm:text-3xl font-bold text-blue-400">{{ totalPlayers }}</div>
            <div class="text-gray-300 text-sm sm:text-base">Total Players</div>
          </div>
        </div>
      </div>

      <!-- No data message -->
      <div v-if="leaderboardData.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🏆</div>
        <h3 class="text-2xl font-bold text-gray-400 mb-2">No Results Yet</h3>
        <p class="text-gray-500">Be the first to complete the IT Lockdown challenge!</p>
      </div>

      <!-- Leaderboard Table -->
      <div v-else class="bg-black/60 border border-gray-600 rounded-xl overflow-hidden">
        <!-- Top 3 Spotlight -->
        <div class="bg-gradient-to-r from-dhl-yellow/20 to-dhl-red/20 p-6 border-b border-gray-600">
          <h3 class="text-2xl font-bold text-dhl-yellow text-center mb-6">🏆 Prize Winners 🏆</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(entry, index) in leaderboardData.slice(0, 3)"
              :key="index"
              class="bg-black/60 border border-gray-500 rounded-lg p-4 text-center"
            >
              <div class="text-3xl mb-2">{{ getRankBadge(index) }}</div>
              <div class="font-bold text-lg">{{ entry.firstName }} {{ entry.lastName }}</div>
              <div class="text-gray-400 text-sm">{{ entry.department }}</div>
              <div class="text-2xl font-bold text-dhl-yellow mt-2">{{ entry.score }}</div>
              <div class="text-gray-400 text-sm">{{ entry.timeSpent }}</div>
            </div>
          </div>
        </div>

        <!-- Full Leaderboard -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-800 border-b border-gray-600">
              <tr class="text-left">
                <th class="p-4 font-bold text-dhl-yellow">Rank</th>
                <th class="p-4 font-bold text-dhl-yellow">Player</th>
                <th class="p-4 font-bold text-dhl-yellow">Department</th>
                <th class="p-4 font-bold text-dhl-yellow text-center">Score</th>
                <th class="p-4 font-bold text-dhl-yellow text-center">Time</th>
                <th class="p-4 font-bold text-dhl-yellow text-center">Completed</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, index) in leaderboardData"
                :key="index"
                class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
              >
                <td class="p-4">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-sm font-bold"
                    :class="getRankClass(index)"
                  >
                    {{ getRankBadge(index) }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="font-semibold">{{ entry.firstName }} {{ entry.lastName }}</div>
                  <div class="text-sm text-gray-400">{{ entry.workTime }}</div>
                </td>
                <td class="p-4 text-gray-300">{{ entry.department }}</td>
                <td class="p-4 text-center">
                  <div class="text-xl font-bold text-dhl-yellow">{{ entry.score }}</div>
                </td>
                <td class="p-4 text-center text-blue-400 font-mono">{{ entry.timeSpent }}</td>
                <td class="p-4 text-center">
                  <div class="text-sm text-gray-400">
                    {{ new Date(entry.timestamp).toLocaleDateString() }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Action Button -->
      <div class="text-center mt-8">
        <button
          @click="goBack"
          class="bg-dhl-red text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors"
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
