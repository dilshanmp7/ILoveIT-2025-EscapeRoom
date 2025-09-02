<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'
import { useGameStore } from '@/stores/gameStore'
const playerStore = usePlayerStore()
const gameStore = useGameStore()
playerStore.applyTimePenalty(gameStore.elapsedTime)
const timeFormatter = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}
</script>
<template>
  <div
    class="w-full h-full flex flex-col items-center justify-center bg-dhl-yellow text-gray-900 p-8"
  >
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/a/a2/DHL_Logo.svg"
      alt="DHL Logo"
      class="w-64 mb-8"
    />
    <h1 class="text-5xl font-bold font-delivery text-dhl-red mb-4 text-center">
      SYSTEMS RESTORED!
    </h1>
    <div class="bg-white p-8 rounded-lg shadow-2xl text-center">
      <h2 class="text-2xl font-bold mb-2">Your Team's Final Score</h2>
      <p class="text-5xl font-black text-dhl-red">{{ playerStore.score.toLocaleString() }}</p>
      <p class="text-lg text-gray-600 mb-6">Points</p>
      <p class="text-3xl font-bold">{{ timeFormatter(gameStore.elapsedTime) }}</p>
      <p class="text-md text-gray-600">Total Mission Time</p>
    </div>
    <p class="text-xl max-w-3xl text-center mt-8">
      Congratulations! Your team's expertise and quick thinking have neutralized the threat and
      restored full functionality to the DHL Global IT network.
    </p>
  </div>
</template>
