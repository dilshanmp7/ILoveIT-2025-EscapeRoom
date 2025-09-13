<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useRoomStore } from '@/stores/roomStore'
import dhlLogo from '@/assets/dhl_logo2.png'
import dhlLoveIt2025Background from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'
import iLoveItLogo from '@/assets/IloveIT.png'

const router = useRouter()
const gameStore = useGameStore()
const playerStore = usePlayerStore()
const roomStore = useRoomStore()

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
const gameJustStarted = ref(false) // 🔧 NEW: Track if we just started a game

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
  'Program Management',
  'Other',
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

// 🔧 NEW: Watch for form changes to reset "already played" status for different players
watch([firstName, lastName], () => {
  // Reset already played status when player details change
  // This allows a new player to register on the same browser
  if (hasAlreadyPlayed.value) {
    hasAlreadyPlayed.value = false
    finalResult.value = null
    errorMessage.value = ''
  }
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
        gameInProgress: result.gameInProgress || false,
        playerData: result.playerData || result.gameData, // Fix: Handle both playerData and gameData
        gameData: result.gameData, // Also provide gameData for game-in-progress cases
        message: result.message,
      }
    }

    return { exists: false }
  } catch (error) {
    console.error('Error checking existing player:', error)
    // If server check fails, allow registration but show warning
    return { exists: false, serverError: true }
  }
}

// Resume a game in progress with hybrid local/database validation
const resumeGameInProgress = async (playerCheck: any) => {
  try {
    console.log('🔄 Resuming game in progress...', playerCheck)

    // Set player info from the saved game data
    const gameData = playerCheck.gameData || playerCheck.playerData

    console.log('🔍 Game data found:', !!gameData)
    console.log('🔍 Game data keys:', gameData ? Object.keys(gameData) : 'No data')

    if (!gameData) {
      throw new Error('No game data found in playerCheck object')
    }

    // Extract player info from the game data
    const playerInfo = {
      firstName: gameData.firstName || 'Unknown',
      lastName: gameData.lastName || 'Unknown',
      department: gameData.department || department.value,
      workTime: gameData.workTime || workTime.value,
    }

    console.log('🔄 Setting player info:', playerInfo)
    playerStore.setPlayerInfo(playerInfo)

    // ✅ HYBRID APPROACH: Try local data first, validate against database
    console.log('🔄 Attempting fast local restoration...')

    // Try to restore from localStorage first (faster)
    let localStateValid = false
    try {
      const localGameState = localStorage.getItem('escaperoomGameState')
      const localRoomState = localStorage.getItem('escaperoomRoomState')
      const localPlayerState = localStorage.getItem('escaperoomPlayerState')

      if (localGameState && localRoomState && localPlayerState) {
        const gameState = JSON.parse(localGameState)

        // ✅ ANTI-CHEAT: Validate critical scoring data against database
        const dbScoring = gameData.gameState || {}
        const localScoring = JSON.parse(localPlayerState)

        const scoringMatches =
          localScoring.wrongAnswerPenalties <= (dbScoring.wrongAnswerPenalties || 0) &&
          localScoring.hintsUsed <= (dbScoring.hintsUsed || 0) &&
          gameState.startTime === gameData.gameStartTime

        if (scoringMatches) {
          console.log('✅ Local state validated - using fast local restoration')

          // Use fast local restoration
          gameStore.rehydrate(gameState)

          // Rehydrate stores from localStorage
          const roomState = JSON.parse(localRoomState)
          roomStore.rehydrate(roomState)
          playerStore.rehydrate() // Uses localStorage internally

          localStateValid = true
        } else {
          console.warn('⚠️ Local state tampering detected - falling back to database')
        }
      }
    } catch (error) {
      console.warn('⚠️ Local state corrupted - falling back to database:', error)
    }

    // If local validation failed, use authoritative database restoration
    if (!localStateValid) {
      console.log('🔄 Using authoritative database restoration...')

      // ✅ ANTI-CHEAT: Restore comprehensive game state from database
      console.log('🔄 Restoring player scoring state from database...')
      playerStore.restoreStateFromDatabase(gameData)

      console.log('🔄 Restoring room progress state from database...')
      roomStore.restoreStateFromDatabase(gameData)

      // Restore the game timer state
      const savedGameState = {
        gameState: 'playing',
        currentRoomIndex: gameData.currentRoomIndex || 0,
        startTime: gameData.gameStartTime, // Use the original game start time
      }

      // Restore local game state
      gameStore.rehydrate(savedGameState)
    }

    console.log('🎯 Game resumed successfully!')
    router.push('/game')
  } catch (error) {
    console.error('❌ Failed to resume game:', error)
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error))
    console.error('❌ playerCheck object:', playerCheck)
    errorMessage.value = 'Failed to resume your game. Please try again.'
  } finally {
    isCheckingPlayer.value = false
  }
}

// NEW: Enhanced function to handle starting the mission with server validation
async function handleStartMission() {
  console.log('🎮 handleStartMission called - start')
  
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  // 🔧 FIX: Prevent multiple simultaneous executions
  if (isCheckingPlayer.value) {
    console.log('⚠️ Registration already in progress, ignoring duplicate request')
    return
  }

  console.log('🎮 Starting tournament registration validation...')
  isCheckingPlayer.value = true
  errorMessage.value = ''

  try {
    // 🔧 FIX: Check if different player is trying to register on same browser
    const localPlayerState = localStorage.getItem('playerStore')
    if (localPlayerState) {
      try {
        const savedPlayerData = JSON.parse(localPlayerState)
        const currentPlayerKey = `${firstName.value.trim()}-${lastName.value.trim()}`.toLowerCase()
        const savedPlayerKey = `${savedPlayerData.firstName || ''}-${
          savedPlayerData.lastName || ''
        }`.toLowerCase()

        if (currentPlayerKey !== savedPlayerKey) {
          console.log('🔄 Different player detected, clearing previous game data...')
          // Clear all game-related localStorage data for the previous player
          localStorage.removeItem('escaperoomGameState')
          localStorage.removeItem('escaperoomRoomState')
          localStorage.removeItem('playerStore')
          localStorage.removeItem('dhl-it-lockdown-completed-game')

          // Reset stores to initial state
          playerStore.reset()
          roomStore.reset()

          // Reset game store manually
          gameStore.gameState = 'intro'
          gameStore.currentRoomIndex = 0
          gameStore.startTime = 0

          console.log('✅ Previous player data cleared, proceeding with new registration')
        }
      } catch (error) {
        console.warn('⚠️ Error checking saved player data:', error)
        // If there's an error parsing, clear the corrupted data
        localStorage.removeItem('playerStore')
      }
    }

    // Check server for existing player
    const playerCheck = await checkExistingPlayer()

    if (playerCheck.exists) {
      console.log('🚫 Player already participated in tournament or has game in progress')

      if (playerCheck.gameInProgress) {
        // 🔧 FIX: Don't show "game in progress" if we just started the game ourselves
        if (gameJustStarted.value) {
          console.log('🎯 Ignoring "game in progress" because we just started this game')
          // Reset the flag and continue with normal game flow
          gameJustStarted.value = false
          // Navigate to game
          router.push('/game')
          return
        }

        // Offer to resume the game in progress
        const resumeGame = confirm(
          'You have a game in progress. Would you like to continue your current game?'
        )

        if (resumeGame) {
          await resumeGameInProgress(playerCheck)
          return
        } else {
          errorMessage.value =
            'Please use the same registration details to continue your current game.'
          isCheckingPlayer.value = false
          return
        }
      }

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

    // Set player info first
    playerStore.setPlayerInfo({
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      department: department.value,
      workTime: workTime.value,
    })

    // Start the game locally to get the timer
    gameStore.startGame()

    // ✅ ANTI-CHEAT: Mark game as started in database with timer info
    try {
      const startGameResponse = await fetch('/api/start-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          department: department.value,
          gameStartTime: gameStore.startTime, // Include the game start time
        }),
      })

      const startGameResult = await startGameResponse.json()

      if (!startGameResult.success) {
        if (startGameResult.alreadyCompleted) {
          hasAlreadyPlayed.value = true
          isCheckingPlayer.value = false
          return
        }
        if (startGameResult.gameInProgress) {
          errorMessage.value =
            'You already have a game in progress. Please continue your current game.'
          isCheckingPlayer.value = false
          return
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to mark game start in database, proceeding locally:', error)
    }

    console.log('🎯 Game started successfully!')

    // 🔧 FIX: Mark that we just started a game to prevent immediate "game in progress" detection
    gameJustStarted.value = true

    // Navigate to a non-special route so App.vue uses game state system
    router.push('/game')
  } catch (error) {
    console.error('❌ Error during player validation:', error)
    errorMessage.value = 'Unable to validate player. Please try again.'
  } finally {
    isCheckingPlayer.value = false
  }
}

// NEW: Check for completed game on component mount (both local and server)
onMounted(async () => {
  // 🔧 FIX: Check for cross-player contamination on component mount
  // This handles the case where localStorage contains previous player's active game
  const localGameState = localStorage.getItem('escaperoomGameState')
  const localPlayerState = localStorage.getItem('playerStore')

  if (localGameState && localPlayerState) {
    try {
      const gameState = JSON.parse(localGameState)
      const playerData = JSON.parse(localPlayerState)

      // If there's an active game but no form input, this is likely cross-player contamination
      if (gameState.gameState === 'playing' && !firstName.value.trim() && !lastName.value.trim()) {
        console.log(
          '🧹 Detected cross-player contamination on mount - clearing previous player data'
        )

        // Clear all localStorage data from previous player
        localStorage.removeItem('escaperoomGameState')
        localStorage.removeItem('escaperoomRoomState')
        localStorage.removeItem('playerStore')
        localStorage.removeItem('dhl-it-lockdown-completed-game')

        // Reset stores to clean state
        gameStore.gameState = 'intro'
        gameStore.currentRoomIndex = 0
        gameStore.startTime = 0
        playerStore.reset()
        roomStore.reset()

        console.log('✅ Cross-player contamination cleared on mount')
        return // Skip further processing
      }
    } catch (error) {
      console.warn('⚠️ Error checking for cross-player contamination:', error)
      // Clear corrupted data
      localStorage.removeItem('escaperoomGameState')
      localStorage.removeItem('playerStore')
      localStorage.removeItem('escaperoomRoomState')
    }
  }

  // Original completed game check logic
  const completedGame = localStorage.getItem('dhl-it-lockdown-completed-game')
  if (completedGame) {
    try {
      const data = JSON.parse(completedGame)

      // Only show completed game if form is pre-filled with same player details
      if (firstName.value.trim() && lastName.value.trim()) {
        const currentPlayerKey = `${firstName.value.trim()}-${lastName.value.trim()}`.toLowerCase()
        const completedPlayerKey = `${data.firstName || ''}-${data.lastName || ''}`.toLowerCase()

        if (currentPlayerKey === completedPlayerKey) {
          hasAlreadyPlayed.value = true
          finalResult.value = {
            name: `${data.firstName} ${data.lastName}`,
            score: data.score,
            timeSpent: data.timeSpent || '00:00',
            rank: data.rank,
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error parsing completed game data:', error)
      // Clear corrupted data
      localStorage.removeItem('dhl-it-lockdown-completed-game')
    }
  }
})
</script>
<template>
  <div
    class="w-full h-screen flex items-center justify-center text-white p-1 mobile:p-2 sm:p-3 laptop:p-4 large:p-6 overflow-hidden"
    :style="{
      backgroundImage: `url('${dhlLoveIt2025Background}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <!-- Dark overlay for better text readability -->
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>

    <div
      class="relative z-10 flex flex-col items-center justify-center max-w-sm mobile:max-w-md sm:max-w-lg laptop:max-w-2xl large:max-w-4xl w-full max-h-full overflow-y-auto"
    >
      <!-- DHL Logo - Responsive sizing -->
      <img
        :src="dhlLogo"
        alt="DHL Logo"
        class="w-16 mobile:w-20 sm:w-24 laptop:w-20 large:w-32 mb-1 mobile:mb-2 sm:mb-3 laptop:mb-1 large:mb-4"
      />

      <!-- Game Title - Responsive typography -->
      <h1
        class="text-lg mobile:text-xl sm:text-2xl laptop:text-2xl large:text-4xl font-bold font-delivery text-dhl-yellow mb-2 mobile:mb-3 sm:mb-4 laptop:mb-2 large:mb-6 text-center drop-shadow-lg"
      >
        The IT Lockdown
      </h1>

      <!-- Subtitle with I Love IT Logo - Responsive layout -->
      <div
        class="flex items-center justify-center gap-2 mobile:gap-3 laptop:gap-2 large:gap-5 mb-3 mobile:mb-4 laptop:mb-2 large:mb-8"
      >
        <span class="text-base mobile:text-lg laptop:text-sm large:text-2xl drop-shadow-md"
          >🎯</span
        >
        <img
          :src="iLoveItLogo"
          alt="I Love IT"
          class="w-10 mobile:w-12 sm:w-16 laptop:w-14 large:w-24"
        />
        <span
          class="text-xs mobile:text-sm sm:text-base laptop:text-sm large:text-xl drop-shadow-md"
          >2025 - Escape Room Challenge</span
        >
      </div>

      <!-- Conditional rendering based on play status -->
      <div v-if="hasAlreadyPlayed && finalResult" class="text-center w-full px-2 mobile:px-4">
        <div
          class="bg-white p-3 mobile:p-4 sm:p-6 laptop:p-8 large:p-10 rounded-lg shadow-2xl max-w-xs mobile:max-w-md laptop:max-w-lg large:max-w-xl mx-auto"
        >
          <div class="mb-3 mobile:mb-4">
            <div
              class="w-12 h-12 mobile:w-16 mobile:h-16 laptop:w-20 laptop:h-20 large:w-24 large:h-24 bg-dhl-red rounded-full flex items-center justify-center mx-auto mb-3 mobile:mb-4"
            >
              <svg
                class="w-6 h-6 mobile:w-8 mobile:h-8 laptop:w-10 laptop:h-10 large:w-12 large:h-12 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2
              class="text-lg mobile:text-xl laptop:text-2xl large:text-3xl font-bold text-gray-800 mb-2"
            >
              Tournament Complete!
            </h2>
            <p
              class="text-sm mobile:text-base laptop:text-lg large:text-xl text-gray-600 mb-3 mobile:mb-4"
            >
              {{ finalResult.name }}
            </p>
          </div>

          <div class="space-y-2 mobile:space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="text-xs mobile:text-sm laptop:text-base large:text-lg text-gray-600"
                >Final Score:</span
              >
              <span
                class="text-lg mobile:text-2xl laptop:text-3xl large:text-4xl font-bold text-dhl-red"
                >{{ finalResult.score }}</span
              >
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
              <span class="text-xs mobile:text-sm laptop:text-base large:text-lg text-gray-600"
                >Time Taken:</span
              >
              <span class="text-sm mobile:text-base laptop:text-lg large:text-xl font-semibold">{{
                finalResult.timeSpent
              }}</span>
            </div>
            <div v-if="finalResult.rank" class="flex justify-between items-center py-2">
              <span class="text-xs mobile:text-sm laptop:text-base large:text-lg text-gray-600"
                >Tournament Rank:</span
              >
              <span
                class="text-sm mobile:text-base laptop:text-lg large:text-xl font-bold text-dhl-yellow bg-gray-800 px-2 mobile:px-3 py-1 rounded"
                >#{{ finalResult.rank }}</span
              >
            </div>
          </div>

          <div
            class="mt-4 mobile:mt-6 p-3 mobile:p-4 bg-yellow-50 border-l-4 border-dhl-yellow rounded"
          >
            <p class="text-xs mobile:text-sm laptop:text-base large:text-lg text-gray-700">
              <strong>🏆 Tournament Rules:</strong> Each player can participate only once to ensure
              fair competition for all DHL employees.
            </p>
          </div>
        </div>

        <div class="mt-4 mobile:mt-6">
          <button
            @click="$router.push('/leaderboard')"
            class="bg-dhl-yellow text-black px-4 mobile:px-6 py-2 mobile:py-3 laptop:py-4 large:py-5 rounded-lg text-sm mobile:text-base laptop:text-lg large:text-xl font-bold hover:bg-yellow-400 transition-colors touch-manipulation"
          >
            View Tournament Leaderboard
          </button>
        </div>
      </div>

      <div v-else class="w-full flex flex-col items-center">
        <!-- Responsive intro text -->
        <p
          class="text-xs mobile:text-sm sm:text-base laptop:text-sm large:text-xl max-w-3xl text-center mb-2 mobile:mb-3 sm:mb-4 laptop:mb-2 large:mb-6 px-2 mobile:px-4"
        >
          Enter your details to begin your mission. You have 45 minutes to escape the IT lockdown.
          Good luck!
        </p>

        <!-- Mobile-optimized registration form - Responsive sizing -->
        <div
          class="w-full max-w-xs mobile:max-w-sm sm:max-w-md laptop:max-w-lg large:max-w-xl bg-white/50 p-2 mobile:p-3 sm:p-4 laptop:p-3 large:p-6 rounded-lg shadow-lg border border-white/20 mx-2 mobile:mx-4"
        >
          <div class="grid grid-cols-1 gap-2 mobile:gap-2 laptop:gap-1 large:gap-3">
            <!-- First Name -->
            <div>
              <label
                for="firstName"
                class="block text-xs mobile:text-sm laptop:text-base large:text-lg font-bold text-gray-800 mb-1"
                >First Name</label
              >
              <input
                v-model="firstName"
                id="firstName"
                type="text"
                class="w-full p-1 mobile:p-2 laptop:p-1 large:p-3 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-xs mobile:text-sm laptop:text-xs large:text-lg"
                placeholder="Enter your first name"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label
                for="lastName"
                class="block text-xs mobile:text-sm laptop:text-base large:text-lg font-bold text-gray-800 mb-1"
                >Last Name</label
              >
              <input
                v-model="lastName"
                id="lastName"
                type="text"
                class="w-full p-1 mobile:p-2 laptop:p-1 large:p-3 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-xs mobile:text-sm laptop:text-xs large:text-lg"
                placeholder="Enter your last name"
              />
            </div>

            <!-- Department -->
            <div>
              <label
                for="department"
                class="block text-xs mobile:text-sm laptop:text-xs large:text-lg font-bold text-gray-800 mb-1"
                >Department</label
              >
              <select
                v-model="department"
                id="department"
                class="w-full p-1 mobile:p-2 laptop:p-1 large:p-3 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-xs mobile:text-sm laptop:text-xs large:text-lg"
              >
                <option disabled value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>

            <!-- Work Time -->
            <div>
              <label
                for="workTime"
                class="block text-xs mobile:text-sm laptop:text-xs large:text-lg font-bold text-gray-800 mb-1"
                >Work Time / Shift</label
              >
              <select
                v-model="workTime"
                id="workTime"
                class="w-full p-1 mobile:p-2 laptop:p-1 large:p-3 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red text-xs mobile:text-sm laptop:text-xs large:text-lg"
              >
                <option disabled value="">Select Work Time</option>
                <option v-for="time in workTimes" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
          </div>

          <!-- Error message display -->
          <div
            v-if="errorMessage"
            class="mt-3 mobile:mt-4 p-2 mobile:p-3 bg-red-100 border border-red-400 text-red-700 rounded text-xs mobile:text-sm laptop:text-base"
          >
            {{ errorMessage }}
          </div>

          <!-- Mobile-optimized button with loading state -->
          <button
            @click="handleStartMission"
            :disabled="!isFormValid || isCheckingPlayer"
            class="w-full bg-dhl-red text-white font-bold py-2 mobile:py-3 laptop:py-2 large:py-4 px-4 mobile:px-6 rounded-lg text-xs mobile:text-sm laptop:text-xs large:text-lg mt-3 mobile:mt-4 laptop:mt-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-700 touch-manipulation flex items-center justify-center min-h-[36px] mobile:min-h-[40px] laptop:min-h-[32px]"
          >
            <svg
              v-if="isCheckingPlayer"
              class="animate-spin -ml-1 mr-3 h-4 w-4 mobile:h-5 mobile:w-5 laptop:h-6 laptop:w-6 text-white"
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

          <p
            class="text-xs mobile:text-xs laptop:text-sm large:text-base text-gray-600 mt-2 mobile:mt-3 text-center"
          >
            ⚠️ Each player can participate in the tournament only once
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
