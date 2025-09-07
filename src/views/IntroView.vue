<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import dhlLogo from '@/assets/dhl_logo2.png'

const gameStore = useGameStore()
const playerStore = usePlayerStore()

// NEW: Local state for form inputs
const firstName = ref('')
const lastName = ref('')
const department = ref('')
const workTime = ref('')

// NEW: State to handle replay prevention and server validation
const hasAlreadyPlayed = ref(false)
const finalResult = ref<{ name: string; score: number; timeSpent: string; rank?: number } | null>(
  null
)
const isCheckingPlayer = ref(false)
const errorMessage = ref('')

const departments = [
  'IT',
  'CCPU', 
  'HR',
  'Operation',
  'Security',
  'NCG',
  'ACS',
  'Engineering',
  'Facility & Support',
  'Finance',
  'Applications',
  'Management',
  'Network Support Group',
  'RAMP',
  'Greenfield Project',
  'EAT',
  'Regional Station',
  'Sort (TDI)',
  'Ramp Neutral',
  'Sort Neutral (TDI)',
  'CPH Nordic Training',
  'Processes',
  'Reception',
  'Sort Control',
  'Sort (DDI)',
  'Operation Support',
  'Sort Neutral (DDI)',
  'Sort Maintenance',
  'CPH- REGULARTORY AND PUBLIC AFFAIRS',
  'CPH - PMO_MAA',
  'CPH - Project Manager_MAA',
  'REGULARTORY AND PUBLIC AFFAIRS',
  'ProcessEngineering',
  'Program Management'
]
const workTimes = ['AM Shift', 'PM Shift', 'Day Time']

// NEW: Computed property to check if form is complete
const isFormValid = computed(() => {
  return (
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
    department.value !== '' &&
    workTime.value !== ''
  )
})

// ✅ TOURNAMENT INTEGRITY - Check if player already participated
const checkExistingPlayer = async () => {
  try {
    const response = await fetch('/api/check-participation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        department: department.value,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && result.hasParticipated) {
      return {
        exists: true,
        playerData: result.playerData,
      }
    }

    return { exists: false }
  } catch (error) {
    console.error('Error checking existing player:', error)
    // If server check fails, allow registration but show warning
    return { exists: false, serverError: true }
  }
}

// NEW: Enhanced function to handle starting the mission with server validation
async function handleStartMission() {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  console.log('🎮 Starting tournament registration validation...')
  isCheckingPlayer.value = true
  errorMessage.value = ''

  try {
    // Check server for existing player
    const playerCheck = await checkExistingPlayer()

    if (playerCheck.exists) {
      console.log('🚫 Player already participated in tournament')
      hasAlreadyPlayed.value = true
      finalResult.value = {
        name: `${playerCheck.playerData.firstName} ${playerCheck.playerData.lastName}`,
        score: playerCheck.playerData.score,
        timeSpent: playerCheck.playerData.timeSpent || '00:00',
        rank: playerCheck.playerData.rank,
      }
      isCheckingPlayer.value = false
      return // Stop here - show existing results
    }

    if (playerCheck.serverError) {
      console.warn('⚠️ Server validation failed, allowing local validation only')
      // Continue with local checks as fallback
    }

    // Player is new, proceed with game
    console.log('✅ New player validated, starting game...')
    playerStore.setPlayerInfo({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      department: department.value,
      workTime: workTime.value,
    })

    gameStore.startGame()
    console.log('🎯 Game started successfully!')
  } catch (error) {
    console.error('❌ Error during player validation:', error)
    errorMessage.value = 'Unable to validate player. Please try again.'
  } finally {
    isCheckingPlayer.value = false
  }
}

// NEW: Check for completed game on component mount (both local and server)
onMounted(async () => {
  // First check localStorage for quick feedback
  const completedGame = localStorage.getItem('dhl-it-lockdown-completed-game')
  if (completedGame) {
    hasAlreadyPlayed.value = true
    const data = JSON.parse(completedGame)
    finalResult.value = {
      name: `${data.firstName} ${data.lastName}`,
      score: data.score,
      timeSpent: data.timeSpent || '00:00',
      rank: data.rank,
    }
  }
})
</script>
<template>
  <div
    class="w-full min-h-screen flex items-center justify-center bg-dhl-yellow text-gray-900 p-4 sm:p-8"
  >
    <div class="flex flex-col items-center justify-center max-w-2xl w-full">
      <!-- Responsive logo -->
      <img :src="dhlLogo" alt="DHL Logo" class="w-48 sm:w-64 mb-4 sm:mb-6" />

      <!-- Responsive title -->
      <h1
        class="text-3xl sm:text-4xl lg:text-5xl font-bold font-delivery text-dhl-red mb-6 sm:mb-8 text-center"
      >
        The IT Lockdown
      </h1>

      <!-- NEW: Conditional rendering based on play status -->
      <div v-if="hasAlreadyPlayed && finalResult" class="text-center w-full px-4">
        <div class="bg-white p-6 sm:p-8 rounded-lg shadow-2xl max-w-md mx-auto">
          <div class="mb-4">
            <div
              class="w-16 h-16 bg-dhl-red rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Tournament Complete!</h2>
            <p class="text-gray-600 mb-4">{{ finalResult.name }}</p>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="text-gray-600">Final Score:</span>
              <span class="text-2xl font-bold text-dhl-red">{{ finalResult.score }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="text-gray-600">Time Taken:</span>
              <span class="font-semibold">{{ finalResult.timeSpent }}</span>
            </div>
            <div v-if="finalResult.rank" class="flex justify-between items-center py-2">
              <span class="text-gray-600">Tournament Rank:</span>
              <span class="font-bold text-dhl-yellow bg-gray-800 px-3 py-1 rounded"
                >#{{ finalResult.rank }}</span
              >
            </div>
          </div>

          <div class="mt-6 p-4 bg-yellow-50 border-l-4 border-dhl-yellow rounded">
            <p class="text-sm text-gray-700">
              <strong>🏆 Tournament Rules:</strong> Each player can participate only once to ensure
              fair competition for all DHL employees.
            </p>
          </div>
        </div>

        <div class="mt-6">
          <button
            @click="$router.push('/leaderboard')"
            class="bg-dhl-yellow text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            View Tournament Leaderboard
          </button>
        </div>
      </div>

      <div v-else class="w-full flex flex-col items-center">
        <!-- Responsive intro text -->
        <p class="text-base sm:text-lg lg:text-xl max-w-3xl text-center mb-6 sm:mb-8 px-4">
          Enter your details to begin your mission. You have 60 minutes to escape the IT lockdown.
          Good luck, agent!
        </p>

        <!-- NEW: Mobile-optimized registration form -->
        <div
          class="w-full max-w-md bg-white/50 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg border border-white/20 mx-4"
        >
          <div class="grid grid-cols-1 gap-4">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-bold text-gray-800 mb-1"
                >First Name</label
              >
              <input
                v-model="firstName"
                id="firstName"
                type="text"
                class="w-full p-3 sm:p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-base"
                placeholder="Enter your first name"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-bold text-gray-800 mb-1"
                >Last Name</label
              >
              <input
                v-model="lastName"
                id="lastName"
                type="text"
                class="w-full p-3 sm:p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-base"
                placeholder="Enter your last name"
              />
            </div>

            <!-- Department -->
            <div>
              <label for="department" class="block text-sm font-bold text-gray-800 mb-1"
                >Department</label
              >
              <select
                v-model="department"
                id="department"
                class="w-full p-3 sm:p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-base"
              >
                <option disabled value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>

            <!-- Work Time -->
            <div>
              <label for="workTime" class="block text-sm font-bold text-gray-800 mb-1"
                >Work Time / Shift</label
              >
              <select
                v-model="workTime"
                id="workTime"
                class="w-full p-3 sm:p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-base"
              >
                <option disabled value="">Select Work Time</option>
                <option v-for="time in workTimes" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
          </div>

          <!-- Error message display -->
          <div
            v-if="errorMessage"
            class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            {{ errorMessage }}
          </div>

          <!-- Mobile-optimized button with loading state -->
          <button
            @click="handleStartMission"
            :disabled="!isFormValid || isCheckingPlayer"
            class="w-full bg-dhl-red text-white font-bold py-4 sm:py-3 px-8 rounded-lg text-lg sm:text-xl mt-6 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-700 touch-manipulation flex items-center justify-center"
          >
            <svg
              v-if="isCheckingPlayer"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isCheckingPlayer ? 'Checking Tournament Status...' : 'Begin Mission' }}
          </button>

          <p class="text-xs text-gray-600 mt-3 text-center">
            ⚠️ Each player can participate in the tournament only once
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
