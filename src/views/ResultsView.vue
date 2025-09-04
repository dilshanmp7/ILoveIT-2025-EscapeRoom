<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center p-4"
  >
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-12">
        <img src="@/assets/dhl_logo2.png" alt="DHL Logo" class="h-16 mx-auto mb-6" />
        <h1
          class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dhl-yellow to-dhl-red mb-4"
        >
          CONGRATULATIONS!
        </h1>
        <h2 class="text-3xl font-semibold text-gray-300 mb-2">You escaped "The IT Lockdown"</h2>
        <div class="text-xl text-gray-400">
          {{ playerStore.firstName }} {{ playerStore.lastName }}
        </div>
        <div class="text-lg text-gray-500">
          {{ playerStore.department }} • {{ playerStore.workTime }}
        </div>
      </div>

      <!-- Main Score Card -->
      <div
        class="bg-gradient-to-r from-dhl-red/20 via-black to-dhl-yellow/20 border-2 border-dhl-yellow rounded-xl p-8 mb-8 text-center shadow-2xl"
      >
        <div class="text-7xl font-bold text-dhl-yellow mb-4">
          {{ playerStore.finalScore }}
        </div>
        <div class="text-2xl text-gray-300 mb-6">Final Score (out of 100)</div>

        <!-- Performance Badge -->
        <div class="mb-6">
          <div
            class="inline-block px-6 py-3 rounded-full text-xl font-bold"
            :class="performanceBadgeClass"
          >
            {{ performanceBadge }}
          </div>
        </div>

        <!-- Game Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div class="bg-black/50 rounded-lg p-4 border border-gray-600">
            <div class="text-3xl font-bold text-blue-400">{{ playerStore.timeSpent }}</div>
            <div class="text-gray-300">Time Taken</div>
          </div>
          <div class="bg-black/50 rounded-lg p-4 border border-gray-600">
            <div class="text-3xl font-bold text-red-400">
              {{ playerStore.wrongAnswerPenalties }}
            </div>
            <div class="text-gray-300">Wrong Answers</div>
          </div>
          <div class="bg-black/50 rounded-lg p-4 border border-gray-600">
            <div class="text-3xl font-bold text-purple-400">{{ playerStore.hintsUsed }}</div>
            <div class="text-gray-300">Hints Used</div>
          </div>
        </div>
      </div>

      <!-- Detailed Breakdown -->
      <div class="bg-black/60 border border-gray-600 rounded-xl p-6 mb-8">
        <h3 class="text-2xl font-bold text-dhl-yellow mb-4 text-center">Score Breakdown</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-700">
            <span class="text-gray-300">Starting Score</span>
            <span class="text-green-400 font-mono text-lg">100</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-700">
            <span class="text-gray-300">
              Time Penalty
              <span v-if="elapsedSeconds <= 60" class="text-green-400"
                >({{ elapsedSeconds }}s ≤ 60s - Perfect Time!)</span
              >
              <span v-else>({{ Math.ceil((elapsedSeconds - 60) / 60) }} extra minutes)</span>
            </span>
            <span
              class="font-mono text-lg"
              :class="timePenalty > 0 ? 'text-red-400' : 'text-green-400'"
            >
              {{ timePenalty > 0 ? '-' : '+' }}{{ timePenalty }}
            </span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-700">
            <span class="text-gray-300"
              >Wrong Answer Penalty ({{ playerStore.wrongAnswerPenalties }} × 5)</span
            >
            <span class="text-red-400 font-mono text-lg"
              >-{{ playerStore.wrongAnswerPenalties * 5 }}</span
            >
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-700">
            <span class="text-gray-300">Hints Penalty ({{ playerStore.hintsUsed }} × 2)</span>
            <span
              class="font-mono text-lg"
              :class="playerStore.hintsPenalty > 0 ? 'text-red-400' : 'text-gray-400'"
            >
              {{ playerStore.hintsPenalty > 0 ? '-' : '' }}{{ playerStore.hintsPenalty }}
            </span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-700">
            <span class="text-gray-300">Completion Bonus</span>
            <span
              class="font-mono text-lg"
              :class="playerStore.completionBonus > 0 ? 'text-green-400' : 'text-gray-400'"
            >
              {{ playerStore.completionBonus > 0 ? '+' : '' }}{{ playerStore.completionBonus }}
            </span>
          </div>
          <div class="flex justify-between items-center py-3 border-t-2 border-dhl-yellow mt-4">
            <span class="text-xl font-bold text-dhl-yellow">Final Score</span>
            <span class="text-xl font-bold text-dhl-yellow font-mono">{{
              playerStore.finalScore
            }}</span>
          </div>
        </div>
      </div>

      <!-- Tournament Message -->
      <div
        class="bg-gradient-to-r from-dhl-yellow/20 to-dhl-red/20 border border-dhl-yellow rounded-lg p-6 mb-8 text-center"
      >
        <h3 class="text-2xl font-bold text-dhl-yellow mb-3">🏆 Tournament Results</h3>
        <p class="text-gray-300 text-lg">
          Your score has been recorded for the tournament leaderboard.
        </p>
        <p class="text-gray-400 mt-2">The top 3 scores will win amazing prizes!</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center space-x-6">
        <button
          @click="viewLeaderboard"
          class="bg-dhl-yellow text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors"
        >
          View Leaderboard
        </button>
        <button
          @click="goHome"
          class="bg-dhl-red text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'

const router = useRouter()
const playerStore = usePlayerStore()

// Calculate derived values for display
const elapsedSeconds = computed(() => {
  if (playerStore.startTime === 0 || playerStore.endTime === 0) return 0
  return Math.floor((playerStore.endTime - playerStore.startTime) / 1000)
})

// Use the time penalty from the store (which uses the new algorithm)
const timePenalty = computed(() => playerStore.timePenalty)

// Performance badge based on final score
const performanceBadge = computed(() => {
  const score = playerStore.finalScore
  if (score >= 90) return 'EXCEPTIONAL'
  if (score >= 80) return 'EXCELLENT'
  if (score >= 70) return 'VERY GOOD'
  if (score >= 60) return 'GOOD'
  if (score >= 50) return 'SATISFACTORY'
  return 'NEEDS IMPROVEMENT'
})

const performanceBadgeClass = computed(() => {
  const score = playerStore.finalScore
  if (score >= 90) return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black'
  if (score >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-400 text-black'
  if (score >= 70) return 'bg-gradient-to-r from-blue-400 to-cyan-400 text-black'
  if (score >= 60) return 'bg-gradient-to-r from-purple-400 to-pink-400 text-black'
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
