<script setup lang="ts">
import { useRouter } from 'vue-router'
import dhlLogo from '@/assets/dhl_logo2.png'
import dhlLoveIt2025Background from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'
import iLoveItLogo from '@/assets/IloveIT.png'

const router = useRouter()

function startGame() {
  router.push('/intro')
}
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
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div
      class="relative z-10 flex flex-col items-center justify-center max-w-xs mobile:max-w-sm sm:max-w-lg laptop:max-w-3xl large:max-w-5xl w-full h-full overflow-y-auto py-1 mobile:py-2"
    >
      <!-- DHL Logo -->
      <img
        :src="dhlLogo"
        alt="DHL Logo"
        class="w-20 mobile:w-18 sm:w-24 laptop:w-40 large:w-50 mb-1 mobile:mb-1 sm:mb-3 laptop:mb-1 large:mb-1"
      />

      <!-- Game Title -->
      <h1
        class="text-base mobile:text-lg sm:text-2xl laptop:text-3xl large:text-4xl font-bold font-delivery text-dhl-yellow mb-1 mobile:mb-2 sm:mb-4 laptop:mb-2 large:mb-1 text-center drop-shadow-lg"
      >
        The IT Lockdown
      </h1>

      <!-- Subtitle with I Love IT Logo -->
      <div
        class="flex items-center justify-center gap-1 mobile:gap-2 laptop:gap-2 large:gap-4 mb-1 mobile:mb-2 laptop:mb-2 large:mb-1"
      >
        <span class="text-xs mobile:text-sm laptop:text-sm large:text-xl drop-shadow-md">🎯</span>
        <img
          :src="iLoveItLogo"
          alt="I Love IT"
          class="w-6 mobile:w-8 sm:w-12 laptop:w-12 large:w-20"
        />
        <span
          class="text-xs mobile:text-xs sm:text-base laptop:text-sm large:text-xl drop-shadow-md"
          >I love IT 2025 - Escape Room Challenge</span
        >
      </div>

      <!-- Welcome Content Container -->
      <div
        class="w-full max-w-xs mobile:max-w-sm sm:max-w-md laptop:max-w-xl large:max-w-3xl bg-black/70 p-2 mobile:p-2 sm:p-4 laptop:p-3 large:p-3 rounded-lg shadow-2xl border border-dhl-yellow/30 mx-1 mobile:mx-2"
      >
        <!-- Welcome Message -->
        <div class="text-center mb-1 mobile:mb-2 laptop:mb-2 large:mb-1">
          <p
            class="text-xs mobile:text-xs laptop:text-sm large:text-lg text-gray-200 leading-tight mobile:leading-relaxed"
          >
            Test your IT knowledge and problem-solving skills in this thrilling escape room
            experience.
          </p>
        </div>

        <!-- Game Rules Section -->
        <div class="mb-1 mobile:mb-2 laptop:mb-2 large:mb-1">
          <h3
            class="text-xs mobile:text-sm laptop:text-base large:text-2xl font-bold text-dhl-red mb-1 mobile:mb-1 laptop:mb-1 large:mb-0.5 flex items-center"
          >
            📋 Game Rules
          </h3>
          <div
            class="space-y-0.5 mobile:space-y-1 laptop:space-y-1 large:space-y-0.5 text-xs mobile:text-xs laptop:text-xs large:text-lg text-gray-200"
          >
            <div class="flex items-start gap-2">
              <span class="text-dhl-yellow font-bold">•</span>
              <span
                ><strong>Time Limit:</strong> You have exactly 45 minutes to complete all
                challenges</span
              >
            </div>
            <div class="flex items-start gap-2">
              <span class="text-dhl-yellow font-bold">•</span>
              <span
                ><strong>One Attempt Only:</strong> Each employee can participate only once in the
                tournament</span
              >
            </div>

            <div class="flex items-start gap-2">
              <span class="text-dhl-yellow font-bold">•</span>
              <span
                ><strong>Difficulty Levels:</strong> Each room contains questions with varying
                difficulty levels from easy to expert</span
              >
            </div>
            <div class="flex items-start gap-2">
              <span class="text-dhl-yellow font-bold">•</span>
              <span
                ><strong>Scoring System:</strong> Points awarded based on correctness and time
                efficiency</span
              >
            </div>
            <div class="flex items-start gap-2">
              <span class="text-dhl-yellow font-bold">•</span>
              <span
                ><strong>Hint System:</strong> Use hints when stuck, but each hint costs 3 points and removes one wrong answer option</span
              >
            </div>
          </div>
        </div>

        <!-- Prizes Section -->
        <div class="mb-1 mobile:mb-2 laptop:mb-2 large:mb-1">
          <h3
            class="text-xs mobile:text-sm laptop:text-base large:text-2xl font-bold text-green-400 mb-1 mobile:mb-1 laptop:mb-1 large:mb-0.5 flex items-center"
          >
            🏆 Prize
          </h3>
          <div
            class="grid grid-cols-1 gap-1 mobile:gap-1 laptop:gap-1 large:gap-1 text-xs mobile:text-xs laptop:text-xs large:text-lg"
          >
            <!-- 1st Place -->
            <div
              class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-1.5 mobile:p-2 laptop:p-2 large:p-3 rounded-lg shadow-md"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs mobile:text-sm">🥇 1st Place Champion</span>
              </div>
              <p class="text-xs mobile:text-xs laptop:text-xs large:text-sm mt-0.5">
                The department of the first-place winner will be rewarded with a celebratory cake!
                🎂 🎉
              </p>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div
          class="bg-dhl-red/20 border border-dhl-red/50 rounded-lg p-1.5 mobile:p-2 laptop:p-2 large:p-3 mb-1 mobile:mb-2 laptop:mb-2 large:mb-1"
        >
          <h4
            class="text-xs mobile:text-xs laptop:text-sm large:text-lg font-bold text-dhl-red mb-1 mobile:mb-1 laptop:mb-1 large:mb-2 flex items-center"
          >
            ⚡ Quick Tips for Success
          </h4>
          <ul
            class="space-y-0.5 mobile:space-y-1 text-xs mobile:text-xs laptop:text-xs large:text-base text-gray-200"
          >
            <li class="flex items-start gap-2">
              <span class="text-dhl-yellow">→</span>
              <span>Read each question carefully and think before answering</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-dhl-yellow">→</span>
              <span>Use your IT knowledge </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-dhl-yellow">→</span>
              <span>Time management</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-dhl-yellow">→</span>
              <span>Stay calm and focused throughout the challenge</span>
            </li>
          </ul>
        </div>

        <!-- Start Game Button -->
        <button
          @click="startGame"
          class="w-full bg-gradient-to-r from-dhl-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 mobile:py-3 laptop:py-3 large:py-2 px-3 mobile:px-4 laptop:px-6 large:px-8 rounded-lg text-xs mobile:text-sm laptop:text-base large:text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] touch-manipulation flex items-center justify-center gap-1 mobile:gap-2"
        >
          <span class="text-sm mobile:text-base laptop:text-lg large:text-2xl">🎮</span>
          <span>START THE CHALLENGE</span>
          <span class="text-sm mobile:text-base laptop:text-lg large:text-2xl">🚀</span>
        </button>

        <!-- Tournament Info -->
        <div class="mt-2 mobile:mt-2 laptop:mt-2 large:mt-1 text-center">
          <p
            class="text-xs mobile:text-xs laptop:text-xs large:text-base text-yellow-400 mt-0.5 mobile:mt-1"
          >
            ⚠️ Remember: One attempt per employee • Fair play for all DHL CPH Hub team members.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the content area */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 214, 0, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 214, 0, 0.7);
}

/* Animation for the start button */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
  }
}

button:hover {
  animation: pulse-glow 2s infinite;
}
</style>
