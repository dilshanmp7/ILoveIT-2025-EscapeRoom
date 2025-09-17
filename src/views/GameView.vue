<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useRoomStore } from '@/stores/roomStore'
import Room from '@/components/Room.vue'
import GameHeader from '@/components/GameHeader.vue' // <-- IMPORT NEW HEADER
import GameFooter from '@/components/GameFooter.vue' // <-- IMPORT NEW FOOTER
import DoorLockPuzzle from '@/components/puzzles/DoorLockPuzzle.vue'
import dhlLoveIt2025Background from '@/assets/DHL_LOVE_IT_ 2025 _Into_1.png'

const gameStore = useGameStore()
const router = useRouter()
const roomStore = useRoomStore()

const currentRoomData = computed(() => gameStore.currentRoom)
const isDoorPuzzleVisible = ref(false)

const elapsedTime = computed(() => gameStore.elapsedTime)
watch(elapsedTime, (newTime) => {
  if (newTime >= 2700) {
    gameStore.timeUp()
    router.push({ name: 'results' })
  }
})

watch(
  () => roomStore.areAllLevelsSolved,
  (isSolved) => {
    if (isSolved) {
      isDoorPuzzleVisible.value = true
    }
  },
  { immediate: true }
)

function onAllLevelsSolved() {
  isDoorPuzzleVisible.value = true
}

function onDoorUnlocked() {
  isDoorPuzzleVisible.value = false
  gameStore.advanceToNextRoom()
}

function handleExitAlert(event: BeforeUnloadEvent) {
  event.preventDefault()
  event.returnValue =
    'Are you sure you want to exit the game? Your progress will be saved, but you will need to resume from where you left off.'
  return 'Are you sure you want to exit the game? Your progress will be saved, but you will need to resume from where you left off.'
}

onMounted(() => {
  if (roomStore.areAllLevelsSolved) {
    isDoorPuzzleVisible.value = true
  }
  window.addEventListener('beforeunload', handleExitAlert)
  window.addEventListener('popstate', handleExitAlert)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleExitAlert)
  window.removeEventListener('popstate', handleExitAlert)
})
</script>

<template>
  <div
    class="w-full h-full relative overflow-hidden flex flex-col"
    :style="{
      backgroundImage: `url('${dhlLoveIt2025Background}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <div class="absolute inset-0 bg-black bg-opacity-20 z-0"></div>

    <GameHeader class="relative flex-shrink-0 z-20" />

    <Room
      :room-data="currentRoomData"
      @all-levels-solved="onAllLevelsSolved"
      class="relative flex-1 overflow-hidden z-10"
    />

    <GameFooter class="relative flex-shrink-0 z-20" />

    <DoorLockPuzzle
      v-if="isDoorPuzzleVisible"
      :puzzle-data="currentRoomData.finalPuzzle"
      @unlocked="onDoorUnlocked"
      @close="isDoorPuzzleVisible = false"
      class="z-30"
    />
  </div>
</template>
