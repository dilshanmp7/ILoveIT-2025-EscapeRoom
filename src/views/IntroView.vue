<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
const gameStore = useGameStore()
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
      Global Fusion IT Escape Challenge
    </h1>
    <p class="text-xl max-w-3xl text-center mb-8">
      Welcome, Agent. A system-wide critical failure is imminent. Your mission is to restore
      stability by solving knowledge challenges in our core IT departments. Collect hints at each
      level to unlock the final override protocols.
    </p>
    <button
      @click="gameStore.startGame"
      class="bg-dhl-red text-white font-bold py-4 px-8 rounded-lg text-2xl hover:bg-red-700 transition-colors"
    >
      Begin Mission
    </button>
  </div>
</template>
