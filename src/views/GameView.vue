<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useRoomStore } from '@/stores/roomStore'
import Room from '@/components/Room.vue'
import GameUI from '@/components/GameUI.vue'
import DoorLockPuzzle from '@/components/puzzles/DoorLockPuzzle.vue'
import dhlLoveIt2025Background from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'

const gameStore = useGameStore()
const roomStore = useRoomStore()

const currentRoomData = computed(() => gameStore.currentRoom)
const isDoorPuzzleVisible = ref(false)

// NEW: Watch the timer and end the game when time is up
const elapsedTime = computed(() => gameStore.elapsedTime)
watch(elapsedTime, (newTime) => {
  if (newTime >= 2700) {
    gameStore.timeUp()
  }
})

// NEW: Watch for all levels solved and restore door puzzle state
watch(
  () => roomStore.areAllLevelsSolved,
  (isSolved) => {
    if (isSolved) {
      isDoorPuzzleVisible.value = true
    }
  },
  { immediate: true } // Check immediately on component mount
)

function onAllLevelsSolved() {
  isDoorPuzzleVisible.value = true
}

function onDoorUnlocked() {
  isDoorPuzzleVisible.value = false
  gameStore.advanceToNextRoom()
}

// NEW: On component mount, check if door puzzle should be visible
onMounted(() => {
  if (roomStore.areAllLevelsSolved) {
    isDoorPuzzleVisible.value = true
  }
})
</script>

<template>
  <div
    class="w-full h-full relative overflow-hidden"
    :style="{
      backgroundImage: `url('${dhlLoveIt2025Background}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <!-- Light overlay for better readability while keeping background visible -->
    <div class="absolute inset-0 bg-black bg-opacity-20"></div>

    <!-- Main game room -->
    <Room
      :room-data="currentRoomData"
      @all-levels-solved="onAllLevelsSolved"
      class="h-full relative z-10"
    />

    <!-- Game UI overlay -->
    <GameUI class="absolute top-0 left-0 right-0 z-20" />

    <!-- Door puzzle modal -->
    <DoorLockPuzzle
      v-if="isDoorPuzzleVisible"
      :puzzle-data="currentRoomData.finalPuzzle"
      @unlocked="onDoorUnlocked"
      @close="isDoorPuzzleVisible = false"
      class="z-30"
    />
  </div>
</template>
