<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dhlLogo from '@/assets/dhl_logo2.png'

interface PlayerResult {
  firstName: string
  lastName: string
  department: string
  score: number
  completed: boolean
  timestamp?: number
}

const allResults = ref<PlayerResult[]>([])
const password = ref('')
const isAuthenticated = ref(false)
const wrongPassword = ref(false)

// Simple admin authentication
const ADMIN_PASSWORD = 'DHL2025Admin!' // Change this to your desired password

function authenticate() {
  if (password.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    wrongPassword.value = false
    loadAllResults()
  } else {
    wrongPassword.value = true
    password.value = ''
  }
}

function loadAllResults() {
  const results: PlayerResult[] = []

  // Load all completed games from localStorage
  // Since we're storing individual games with the key 'dhl-it-lockdown-completed-game'
  // we need to collect all similar keys or modify the storage strategy

  // For now, let's collect from localStorage by iterating through all keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('dhl-it-lockdown-completed-')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}')
        if (data.completed) {
          results.push({
            ...data,
            timestamp: data.timestamp || Date.now(),
          })
        }
      } catch (e) {
        console.warn('Error parsing stored result:', e)
      }
    }
  }

  // Sort by score (highest first)
  allResults.value = results.sort((a, b) => b.score - a.score)
}

function clearAllData() {
  if (confirm('Are you sure you want to clear ALL player data? This cannot be undone!')) {
    // Clear all DHL game related data
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('dhl-it-lockdown') || key.startsWith('escaperoom'))) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
    allResults.value = []
    alert('All player data has been cleared.')
  }
}

function exportData() {
  const dataStr = JSON.stringify(allResults.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `dhl-leaderboard-${new Date().toISOString().split('T')[0]}.json`
  link.click()

  URL.revokeObjectURL(url)
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString()
}

onMounted(() => {
  // Check if already authenticated (for refresh)
  const authCheck = sessionStorage.getItem('dhl-admin-auth')
  if (authCheck === 'authenticated') {
    isAuthenticated.value = true
    loadAllResults()
  }
})

// Store auth state for session
function setAuthState() {
  sessionStorage.setItem('dhl-admin-auth', 'authenticated')
}

// Watch for authentication success to store state
import { watch } from 'vue'
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    setAuthState()
  }
})
</script>

<template>
  <div class="min-h-screen bg-dhl-yellow p-8">
    <!-- Authentication Screen -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center min-h-screen">
      <img :src="dhlLogo" alt="DHL Logo" class="w-48 mb-8" />
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 class="text-2xl font-bold text-center mb-6">Admin Access</h1>
        <div class="mb-4">
          <label for="password" class="block text-sm font-bold text-gray-700 mb-2">
            Admin Password
          </label>
          <input
            v-model="password"
            id="password"
            type="password"
            @keyup.enter="authenticate"
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-dhl-red focus:border-dhl-red"
            placeholder="Enter admin password"
          />
        </div>
        <div v-if="wrongPassword" class="text-red-500 text-sm mb-4">
          Incorrect password. Access denied.
        </div>
        <button
          @click="authenticate"
          class="w-full bg-dhl-red text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Access Leaderboard
        </button>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center">
          <img :src="dhlLogo" alt="DHL Logo" class="w-32 mr-4" />
          <h1 class="text-4xl font-bold font-delivery text-dhl-red">Admin Leaderboard</h1>
        </div>
        <div class="flex space-x-4">
          <button
            @click="loadAllResults"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
          <button
            @click="exportData"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Export Data
          </button>
          <button
            @click="clearAllData"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-dhl-red">{{ allResults.length }}</div>
          <div class="text-gray-600">Total Players</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-dhl-red">
            {{
              allResults.length > 0
                ? Math.max(...allResults.map((r) => r.score)).toLocaleString()
                : '0'
            }}
          </div>
          <div class="text-gray-600">Highest Score</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-dhl-red">
            {{
              allResults.length > 0
                ? Math.round(
                    allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length
                  ).toLocaleString()
                : '0'
            }}
          </div>
          <div class="text-gray-600">Average Score</div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="text-2xl font-bold text-dhl-red">
            {{ allResults.filter((r) => r.completed).length }}
          </div>
          <div class="text-gray-600">Completed Games</div>
        </div>
      </div>

      <!-- Leaderboard Table -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-6 py-4 bg-dhl-red text-white">
          <h2 class="text-xl font-bold">Player Results</h2>
        </div>

        <div v-if="allResults.length === 0" class="p-8 text-center text-gray-500">
          No player results found.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Player Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(result, index) in allResults"
                :key="index"
                :class="index < 3 ? 'bg-yellow-50' : ''"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span v-if="index === 0" class="text-2xl">🥇</span>
                    <span v-else-if="index === 1" class="text-2xl">🥈</span>
                    <span v-else-if="index === 2" class="text-2xl">🥉</span>
                    <span v-else class="text-sm font-medium text-gray-900">{{ index + 1 }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ result.firstName }} {{ result.lastName }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ result.department }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-dhl-red">
                    {{ result.score.toLocaleString() }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="result.completed"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    Completed
                  </span>
                  <span
                    v-else
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                  >
                    Incomplete
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ result.timestamp ? formatDate(result.timestamp) : 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
