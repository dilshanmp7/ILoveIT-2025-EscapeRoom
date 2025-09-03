<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
}

const router = useRouter()
const leaderboardData = ref<LeaderboardEntry[]>([])

// Load leaderboard data from localStorage
onMounted(() => {
  const data = localStorage.getItem('leaderboard')
  if (data) {
    leaderboardData.value = JSON.parse(data)
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score) // Sort by score descending
      .slice(0, 50) // Show top 50
  }
})

// Computed properties for statistics
const topScore = computed(() =>
  leaderboardData.value.length > 0 ? leaderboardData.value[0].score : 0
)
const averageScore = computed(() => {
  if (leaderboardData.value.length === 0) return 0
  const sum = leaderboardData.value.reduce((acc, entry) => acc + entry.score, 0)
  return Math.round((sum / leaderboardData.value.length) * 10) / 10
})
const totalPlayers = computed(() => leaderboardData.value.length)

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
      <!-- Header -->
      <div class="text-center mb-8">
        <img :src="dhlLogo" alt="DHL Logo" class="h-16 mx-auto mb-6" />
        <h1
          class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dhl-yellow to-dhl-red mb-4"
        >
          Tournament Leaderboard
        </h1>
        <h2 class="text-2xl text-gray-300 mb-6">"The IT Lockdown" Champions</h2>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-black/60 border border-dhl-yellow rounded-lg p-4">
            <div class="text-3xl font-bold text-dhl-yellow">{{ topScore }}</div>
            <div class="text-gray-300">Top Score</div>
          </div>
          <div class="bg-black/60 border border-dhl-red rounded-lg p-4">
            <div class="text-3xl font-bold text-dhl-red">{{ averageScore }}</div>
            <div class="text-gray-300">Average Score</div>
          </div>
          <div class="bg-black/60 border border-gray-600 rounded-lg p-4">
            <div class="text-3xl font-bold text-blue-400">{{ totalPlayers }}</div>
            <div class="text-gray-300">Total Players</div>
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
