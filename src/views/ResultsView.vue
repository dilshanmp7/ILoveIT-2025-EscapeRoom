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
        alt="Win"
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
      class="max-w-2xl mobile:max-w-3xl sm:max-w-4xl laptop:max-w-5xl large:max-w-6xl w-full relative z-20"
    >
      <div class="text-center mb-6 mobile:mb-8 sm:mb-10 laptop:mb-12 large:mb-16">
        <img
          src="@/assets/dhl_logo2.png"
          alt="DHL Logo"
          class="h-8 mobile:h-10 sm:h-12 laptop:h-16 large:h-20 mx-auto mb-3 mobile:mb-4 sm:mb-6 laptop:mb-8"
        />
        <h1
          class="text-2xl mobile:text-3xl sm:text-4xl laptop:text-5xl large:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dhl-yellow to-dhl-red mb-2 mobile:mb-3 sm:mb-4 laptop:mb-5"
        >
          CONGRATULATIONS!
        </h1>
        <h2
          class="text-lg mobile:text-xl sm:text-2xl laptop:text-3xl large:text-4xl font-semibold text-gray-300 mb-1 mobile:mb-2"
        >
          You escaped "The IT Lockdown"
        </h2>
        <div class="text-base mobile:text-lg laptop:text-xl large:text-2xl text-gray-400">
          {{ playerStore.firstName }} {{ playerStore.lastName }}
        </div>
        <div class="text-sm mobile:text-base laptop:text-lg large:text-xl text-gray-500">
          {{ playerStore.department }} • {{ playerStore.workTime }}
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-dhl-red/20 via-black to-dhl-yellow/20 border-2 border-dhl-yellow rounded-xl p-3 mobile:p-4 sm:p-6 laptop:p-8 large:p-10 mb-4 mobile:mb-6 sm:mb-8 laptop:mb-10 text-center shadow-2xl"
      >
        <div
          class="text-4xl mobile:text-5xl sm:text-6xl laptop:text-7xl large:text-8xl font-bold text-dhl-yellow mb-2 mobile:mb-3 sm:mb-4 laptop:mb-5"
        >
          {{ playerStore.finalScore }}
        </div>
        <div
          class="text-base mobile:text-lg sm:text-xl laptop:text-2xl large:text-3xl text-gray-300 mb-3 mobile:mb-4 sm:mb-6 laptop:mb-8"
        >
          Final Score (out of 100)
        </div>
        <div class="mb-3 mobile:mb-4 sm:mb-6 laptop:mb-8">
          <div
            class="inline-block px-3 mobile:px-4 sm:px-6 laptop:px-8 large:px-10 py-2 mobile:py-2 sm:py-3 laptop:py-4 large:py-5 rounded-full text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl font-bold"
            :class="performanceBadgeClass"
          >
            {{ performanceBadge }}
          </div>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-3 gap-2 mobile:gap-3 sm:gap-4 laptop:gap-6 large:gap-8 mt-4 mobile:mt-6 sm:mt-8 laptop:mt-10"
        >
          <div
            class="bg-black/50 rounded-lg p-2 mobile:p-3 sm:p-4 laptop:p-5 large:p-6 border border-gray-600"
          >
            <div
              class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl font-bold text-blue-400"
            >
              {{ playerStore.timeSpent }}
            </div>
            <div
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl"
            >
              Time Taken
            </div>
          </div>
          <div
            class="bg-black/50 rounded-lg p-2 mobile:p-3 sm:p-4 laptop:p-5 large:p-6 border border-gray-600"
          >
            <div
              class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl font-bold text-red-400"
            >
              {{ playerStore.wrongAnswerPenalties }}
            </div>
            <div
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl"
            >
              Wrong Answers
            </div>
          </div>
          <div
            class="bg-black/50 rounded-lg p-2 mobile:p-3 sm:p-4 laptop:p-5 large:p-6 border border-gray-600"
          >
            <div
              class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl font-bold text-purple-400"
            >
              {{ playerStore.hintsUsed }}
            </div>
            <div
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl"
            >
              Hints Used
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-black/60 border border-gray-600 rounded-xl p-3 mobile:p-4 sm:p-6 laptop:p-8 large:p-10 mb-4 mobile:mb-6 sm:mb-8 laptop:mb-10"
      >
        <h3
          class="text-lg mobile:text-xl sm:text-2xl laptop:text-3xl large:text-4xl font-bold text-dhl-yellow mb-2 mobile:mb-3 sm:mb-4 laptop:mb-5 text-center"
        >
          Score Breakdown
        </h3>
        <div class="space-y-1 mobile:space-y-2 sm:space-y-3 laptop:space-y-4">
          <div class="flex justify-between items-center py-1 mobile:py-2 border-b border-gray-700">
            <span
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl"
              >Base Score (Game Completion)</span
            >
            <span
              class="text-green-400 font-mono text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl"
              >+90</span
            >
          </div>
          <div
            class="flex justify-between items-start sm:items-center py-1 mobile:py-2 border-b border-gray-700"
          >
            <span
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl flex-1 pr-2"
            >
              Time Penalty
              <span
                v-if="elapsedSeconds <= 120"
                class="text-green-400 block sm:inline text-xs mobile:text-xs sm:text-sm laptop:text-base large:text-lg"
                >({{ Math.floor(elapsedSeconds / 60) }}:{{
                  String(elapsedSeconds % 60).padStart(2, '0')
                }}
                ≤ 2:00 - Perfect Time!)</span
              >
              <span
                v-else
                class="block sm:inline text-xs mobile:text-xs sm:text-sm laptop:text-base large:text-lg"
                >({{ ((elapsedSeconds - 120) / 60).toFixed(1) }} extra minutes beyond 2:00)</span
              >
            </span>
            <span
              class="font-mono text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl flex-shrink-0"
              :class="timePenalty > 0 ? 'text-red-400' : 'text-green-400'"
            >
              {{ timePenalty > 0 ? '-' : '+' }}{{ timePenalty }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1 mobile:py-2 border-b border-gray-700">
            <span
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl"
              >Wrong Answer Penalty ({{ playerStore.wrongAnswerPenalties }} × 3)</span
            >
            <span
              class="text-red-400 font-mono text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl"
              >-{{ playerStore.wrongAnswerPenalties * 3 }}</span
            >
          </div>
          <div class="flex justify-between items-center py-1 mobile:py-2 border-b border-gray-700">
            <span
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl"
              >Hints Penalty ({{ playerStore.hintsUsed }} × 2)</span
            >
            <span
              class="font-mono text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl"
              :class="playerStore.hintsPenalty > 0 ? 'text-red-400' : 'text-gray-400'"
            >
              {{ playerStore.hintsPenalty > 0 ? '-' : '' }}{{ playerStore.hintsPenalty }}
            </span>
          </div>
          <div class="flex justify-between items-center py-1 mobile:py-2 border-b border-gray-700">
            <span
              class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl"
              >Completion Bonus</span
            >
            <span
              class="font-mono text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl"
              :class="playerStore.completionBonus > 0 ? 'text-green-400' : 'text-gray-400'"
            >
              {{ playerStore.completionBonus > 0 ? '+' : '' }}{{ playerStore.completionBonus }}
            </span>
          </div>
          <div
            class="flex justify-between items-center py-2 mobile:py-3 border-t-2 border-dhl-yellow mt-3 mobile:mt-4"
          >
            <span
              class="text-base mobile:text-lg sm:text-xl laptop:text-2xl large:text-3xl font-bold text-dhl-yellow"
              >Final Score</span
            >
            <span
              class="text-base mobile:text-lg sm:text-xl laptop:text-2xl large:text-3xl font-bold text-dhl-yellow font-mono"
              >{{ playerStore.finalScore }}</span
            >
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-dhl-yellow/20 to-dhl-red/20 border border-dhl-yellow rounded-lg p-3 mobile:p-4 sm:p-6 laptop:p-8 large:p-10 mb-4 mobile:mb-6 sm:mb-8 laptop:mb-10 text-center"
      >
        <h3
          class="text-lg mobile:text-xl sm:text-2xl laptop:text-3xl large:text-4xl font-bold text-dhl-yellow mb-1 mobile:mb-2 sm:mb-3 laptop:mb-4"
        >
          🏆 Tournament Results
        </h3>
        <p
          class="text-gray-200 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl mb-2 mobile:mb-3 sm:mb-4 laptop:mb-5"
        >
          You've completed the I Love IT 2025 Escape Room Challenge!
        </p>
        <div
          class="bg-black/40 border rounded-lg p-2 mobile:p-3 laptop:p-4 large:p-5 mb-3 mobile:mb-4"
          :class="submissionStatus.submitted ? 'border-green-500' : 'border-yellow-500'"
        >
          <p
            class="text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl font-medium"
            :class="submissionStatus.submitted ? 'text-green-400' : 'text-yellow-400'"
          >
            {{ submissionStatus.message }}
          </p>
          <p
            v-if="submissionStatus.rank"
            class="text-xs mobile:text-xs sm:text-sm laptop:text-base large:text-lg text-gray-300 mt-1"
          >
            Total Tournament Participants: {{ submissionStatus.rank }}+
          </p>
        </div>
        <p class="text-gray-300 text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl">
          🎯 Thanks for participating in the I Love IT 2025 tournament!
        </p>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-center space-y-3 mobile:space-y-4 sm:space-y-0 sm:space-x-4 laptop:space-x-6 large:space-x-8"
      >
        <button
          @click="viewLeaderboard"
          class="bg-dhl-yellow text-black px-4 mobile:px-6 sm:px-8 laptop:px-10 large:px-12 py-2 mobile:py-3 laptop:py-4 large:py-5 rounded-lg font-bold text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl hover:bg-yellow-400 transition-colors touch-manipulation min-h-[44px] mobile:min-h-[48px]"
        >
          View Leaderboard
        </button>
        <button
          @click="goHome"
          class="bg-dhl-red text-white px-4 mobile:px-6 sm:px-8 laptop:px-10 large:px-12 py-2 mobile:py-3 laptop:py-4 large:py-5 rounded-lg font-bold text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl hover:bg-red-600 transition-colors touch-manipulation min-h-[44px] mobile:min-h-[48px]"
        >
          Return Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import dhlLoveIt2025Background from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'
import iLoveItImage from '@/assets/IloveIT.png'

const router = useRouter()
const playerStore = usePlayerStore()

// Score submission status
const submissionStatus = ref<{
  submitted: boolean
  message: string
  rank: number | null
  error?: string
}>({
  submitted: false,
  message: '',
  rank: null,
})

// Check score submission status on mount
onMounted(async () => {
  // Give a moment for any pending score submission to complete
  setTimeout(async () => {
    // Check if score has been submitted to the central system
    try {
      const rank = await playerStore.getCurrentRank()
      if (rank?.currentRank) {
        submissionStatus.value = {
          submitted: true,
          message: `🏆 Score submitted to tournament! Rank: #${rank.currentRank}`,
          rank: rank.currentRank,
        }
      } else {
        submissionStatus.value = {
          submitted: false,
          message: '📱 Score saved locally. Tournament sync pending.',
          rank: null,
        }
      }
    } catch (error) {
      submissionStatus.value = {
        submitted: false,
        message: '📱 Score saved locally. Tournament server unavailable.',
        rank: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, 2000)
})

// Calculate derived values for display
const elapsedSeconds = computed(() => {
  if (playerStore.startTime === 0 || playerStore.endTime === 0) return 0
  return Math.floor((playerStore.endTime - playerStore.startTime) / 1000)
})

// Use the time penalty from the store (which uses the new algorithm)
const timePenalty = computed(() => playerStore.timePenalty)

// Performance badge based on final score (100-point scale)
const performanceBadge = computed(() => {
  const score = playerStore.finalScore
  if (score >= 95) return 'EXCEPTIONAL' // Near perfect (95-100)
  if (score >= 85) return 'EXCELLENT' // Very good (85-94)
  if (score >= 75) return 'VERY GOOD' // Good performance (75-84)
  if (score >= 65) return 'GOOD' // Decent (65-74)
  if (score >= 50) return 'SATISFACTORY' // Acceptable (50-64)
  return 'NEEDS IMPROVEMENT' // Below 50
})

const performanceBadgeClass = computed(() => {
  const score = playerStore.finalScore
  if (score >= 95) return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black animate-pulse'
  if (score >= 85) return 'bg-gradient-to-r from-green-400 to-emerald-400 text-black'
  if (score >= 75) return 'bg-gradient-to-r from-blue-400 to-cyan-400 text-black'
  if (score >= 65) return 'bg-gradient-to-r from-purple-400 to-pink-400 text-black'
  if (score >= 50) return 'bg-gradient-to-r from-gray-400 to-gray-500 text-black'
  return 'bg-gradient-to-r from-red-400 to-red-500 text-white'
})

function viewLeaderboard() {
  router.push('/leaderboard')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
/* Additional custom styles for the results page */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
