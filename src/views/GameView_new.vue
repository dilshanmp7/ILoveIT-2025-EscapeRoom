<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import Room from '@/components/Room.vue'
import GameUI from '@/components/GameUI.vue'
import DoorLockPuzzle from '@/components/puzzles/DoorLockPuzzle.vue'

const gameStore = useGameStore()
const currentRoomData = computed(() => gameStore.currentRoom)
const isDoorPuzzleVisible = ref(false)

function onAllLevelsSolved() {
  isDoorPuzzleVisible.value = true
}

function onDoorUnlocked() {
  isDoorPuzzleVisible.value = false
  gameStore.advanceToNextRoom()
}
</script>
<template>
  <div class="w-full h-full relative">
    <Room :room-data="currentRoomData" @all-levels-solved="onAllLevelsSolved" />
    <GameUI />
    <DoorLockPuzzle
      v-if="isDoorPuzzleVisible"
      :puzzle-data="currentRoomData.finalPuzzle"
      @unlocked="onDoorUnlocked"
      @close="isDoorPuzzleVisible = false"
    />
  </div>
</template>
