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
    class="w-full h-screen flex items-center justify-center text-white p-2 sm:p-4 overflow-hidden"
    :style="{
      backgroundImage: `url('${dhlLoveIt2025Background}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div
      class="relative z-10 flex flex-col items-center max-w-xs mobile:max-w-sm sm:max-w-lg laptop:max-w-3xl large:max-w-5xl w-full"
    >
      <img
        :src="dhlLogo"
        alt="DHL Logo"
        class="w-20 mobile:w-18 sm:w-24 laptop:w-32 large:w-40 mb-1"
      />

      <h1
        class="text-base mobile:text-lg sm:text-2xl laptop:text-3xl large:text-4xl font-bold font-delivery text-dhl-yellow mb-1 text-center drop-shadow-lg"
      >
        The IT Lockdown
      </h1>

      <div
        class="flex items-center justify-center gap-1 mobile:gap-2 laptop:gap-2 large:gap-4 mb-2"
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

      <div
        class="w-full max-w-xs mobile:max-w-sm sm:max-w-md laptop:max-w-xl large:max-w-3xl bg-black/70 p-2 sm:p-3 rounded-lg shadow-2xl border border-dhl-yellow/30 mx-1 mobile:mx-2"
      >
        <div class="text-center mb-2">
          <p
            class="text-xs laptop:text-sm large:text-base text-gray-200 leading-tight mobile:leading-relaxed"
          >
            Test your IT knowledge and problem-solving skills in this thrilling escape room
            experience.
          </p>
        </div>

        <div class="mb-2">
          <h3
            class="text-xs mobile:text-sm laptop:text-base large:text-xl font-bold text-dhl-red mb-1 flex items-center"
          >
            📋 Game Rules
          </h3>
          <div class="space-y-0.5 text-xs laptop:text-xs large:text-base text-gray-200">
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
                ><strong>Hint System:</strong> Use hints when stuck, but each hint costs 2 points
                and removes some wrong answer options</span
              >
            </div>
            <div class="flex items-start gap-2">
              <span class="text-dhl-yellow font-bold">•</span>
              <span>
                <strong>Forfeit Rule:</strong> If you leave the game before finishing (forfeit),
                your score will be permanently set to
                <span class="text-dhl-red font-bold">40 points</span>.
              </span>
            </div>
          </div>
        </div>

        <div class="mb-2">
          <h3
            class="text-xs mobile:text-sm laptop:text-base large:text-xl font-bold text-green-400 mb-1 flex items-center"
          >
            🏆 Prize
          </h3>
          <div class="grid grid-cols-1 gap-1 text-xs laptop:text-xs large:text-base">
            <div
              class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-1.5 sm:p-2 rounded-lg shadow-md"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs mobile:text-sm">🥇 1st Place Champion</span>
              </div>
              <p class="text-xs large:text-sm mt-0.5">
                The department of the first-place winner will be rewarded with a celebratory cake!
                🎂 🎉
              </p>
            </div>
          </div>
        </div>

        <div class="bg-dhl-red/20 border border-dhl-red/50 rounded-lg p-1.5 sm:p-2 mb-2">
          <h4
            class="text-xs laptop:text-sm large:text-base font-bold text-dhl-red mb-1 flex items-center"
          >
            ⚡ Quick Tips for Success
          </h4>
          <ul class="space-y-0.5 text-xs large:text-sm text-gray-200">
            <li class="flex items-start gap-2">
              <span class="text-dhl-yellow">→</span>
              <span>Read each question carefully and think before answering</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-dhl-yellow">→</span>
              <span>Use your IT knowledge and stay calm</span>
            </li>
          </ul>
        </div>

        <button
          @click="startGame"
          class="w-full bg-gradient-to-r from-dhl-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 sm:py-2.5 px-4 rounded-lg text-sm laptop:text-base large:text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] touch-manipulation flex items-center justify-center gap-2"
        >
          <span class="text-base laptop:text-lg large:text-2xl">🎮</span>
          <span>START THE CHALLENGE</span>
          <span class="text-base laptop:text-lg large:text-2xl">🚀</span>
        </button>

        <div class="mt-1 text-center">
          <p class="text-xs laptop:text-xs large:text-sm text-yellow-400">
            ⚠️ Remember: One attempt per employee • Fair play for all DHL CPH Hub team members.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* NOTE: These scrollbar styles will not be used with the new compact layout,
   but they can be kept in case you add a scrollable element later. */
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
