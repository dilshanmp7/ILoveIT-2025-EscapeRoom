<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import dhlLogo from '@/assets/dhl_logo2.png'

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
async function loadLeaderboard() {
  try {
    isLoading.value = true
    error.value = ''

    const response = await fetch('/api/leaderboard?limit=50')
    const responseText = await response.text()

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
    } else {
      throw new Error(data.error || 'Failed to load leaderboard')
    }
  } catch (fetchError) {
    console.error('❌ Backend leaderboard failed, trying localStorage:', fetchError)
    error.value = 'Live leaderboard unavailable, showing local data'

    // ✅ BACKUP STRATEGY - Fallback to localStorage
    const data = localStorage.getItem('leaderboard')
    if (data) {
      const localData = JSON.parse(data)
        .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score)
        .slice(0, 50)
        .map((entry: LeaderboardEntry, index: number) => ({
          ...entry,
          rank: index + 1,
          playerId: `${entry.firstName}-${entry.lastName}`,
        }))

      leaderboardData.value = localData
      tournamentStats.value = {
        totalPlayers: localData.length,
        topScore: localData[0]?.score || 0,
        averageScore:
          localData.length > 0
            ? Math.round(
                localData.reduce((sum: number, entry: any) => sum + entry.score, 0) /
                  localData.length
              )
            : 0,
      }
      lastUpdated.value = 'Local data - ' + new Date().toLocaleTimeString()
    } else {
      // 🚧 DEVELOPMENT MODE - Create demo leaderboard when no data exists
      const demoData = [
        {
          firstName: 'Demo',
          lastName: 'Player',
          department: 'Development',
          workTime: 'Morning',
          score: 95,
          timeSpent: '01:45',
          timestamp: Date.now(),
          rank: 1,
          playerId: 'demo-player',
        },
      ]
      leaderboardData.value = demoData
      tournamentStats.value = {
        totalPlayers: 1,
        topScore: 95,
        averageScore: 95,
      }
      lastUpdated.value = 'Demo data - ' + new Date().toLocaleTimeString()
      error.value = 'Development mode - API endpoints need Vercel deployment'
    }
  } finally {
    isLoading.value = false
  }
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

// Manual refresh function
async function refreshLeaderboard() {
  await loadLeaderboard()
}

// Computed properties for display
const topScore = computed(() => tournamentStats.value.topScore)
const averageScore = computed(() => tournamentStats.value.averageScore)
const totalPlayers = computed(() => tournamentStats.value.totalPlayers)

function getRankBadge(index: number) {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return `#${index + 1}`
}

function getRankClass(index: number) {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black'
  if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black'
  if (index === 2) return 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white'
  return 'bg-gray-600 text-white'
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
    <div class="max-w-6xl mx-auto">
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
