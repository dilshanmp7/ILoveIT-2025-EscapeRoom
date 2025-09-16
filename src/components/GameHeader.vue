<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { ROOM_DATA } from '@/gameData'
import dhlLogo from '@/assets/dhl_logo2.png'
import iLoveItLogo from '@/assets/IloveIT.png'

const gameStore = useGameStore()

const formattedTime = computed(() => {
  if (gameStore.gameState !== 'playing') return '45:00'
  const totalSeconds = Math.max(0, 45 * 60 - gameStore.elapsedTime)
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

// This is the advanced room progress logic from your original file
const roomProgress = computed(() => {
  return ROOM_DATA.map((room, index) => ({
    id: room.id,
    name: room.name,
    isCompleted: index < gameStore.currentRoomIndex,
    isCurrent: index === gameStore.currentRoomIndex,
    isLocked: index > gameStore.currentRoomIndex,
  }))
})
</script>

<template>
  <header
    class="relative w-full px-1 py-1 mobile:px-2 mobile:py-1 sm:px-2 sm:py-1 laptop:px-3 laptop:py-1 large:px-3 large:py-1 bg-black/90 border-b border-gray-600 flex justify-between items-center z-20"
  >
    <div class="flex items-center overflow-hidden flex-shrink-0">
      <div
        class="flex items-center gap-1 mobile:gap-1 sm:gap-1 laptop:gap-2 large:gap-2 mr-1 mobile:mr-1 sm:mr-2"
      >
        <img :src="dhlLogo" alt="DHL Logo" class="h-3 mobile:h-4 sm:h-5 laptop:h-6 large:h-7" />
        <img
          :src="iLoveItLogo"
          alt="I Love IT"
          class="h-2 mobile:h-3 sm:h-4 laptop:h-5 large:h-6"
        />
      </div>
    </div>

    <div class="flex items-center gap-2 sm:hidden flex-1 justify-center">
      <h1 class="text-xs mobile:text-xs font-bold text-dhl-yellow truncate">
        {{ gameStore.currentRoom.name }}
      </h1>
      <div class="flex items-center gap-1">
        <div v-for="(room, index) in roomProgress" :key="room.id" class="flex items-center">
          <div
            class="text-xs transition-all duration-300"
            :class="{
              'text-green-400': room.isCompleted,
              'text-dhl-yellow': room.isCurrent,
              'text-gray-600': room.isLocked,
            }"
          >
            <span v-if="room.isLocked">🔒</span>
            <span v-else>🚪</span>
          </div>
          <div
            v-if="index < roomProgress.length - 1"
            class="w-1 h-0.5 mx-0.5"
            :class="{
              'bg-green-400': room.isCompleted,
              'bg-dhl-yellow': room.isCurrent,
              'bg-gray-600': room.isLocked,
            }"
          ></div>
        </div>
      </div>
    </div>

    <div
      class="hidden sm:flex items-center absolute left-1/2 transform -translate-x-1/2 gap-3 laptop:gap-4 large:gap-6"
    >
      <h1
        class="text-sm sm:text-lg lg:text-xl laptop:text-2xl large:text-3xl font-bold text-dhl-yellow whitespace-nowrap"
      >
        {{ gameStore.currentRoom.name }}
      </h1>
      <div class="hidden laptop:flex items-center gap-1 large:gap-2">
        <div v-for="(room, index) in roomProgress" :key="room.id" class="flex items-center">
          <div class="flex flex-col items-center">
            <div
              class="text-sm large:text-base transition-all duration-300"
              :class="{
                'text-green-400': room.isCompleted,
                'text-dhl-yellow animate-pulse': room.isCurrent,
                'text-gray-600': room.isLocked,
              }"
            >
              <span v-if="room.isLocked">🔒</span>
              <span v-else>🚪</span>
            </div>
            <div
              class="text-xs large:text-xs font-medium text-center max-w-[40px] large:max-w-[45px] truncate"
              :class="{
                'text-green-400': room.isCompleted,
                'text-dhl-yellow': room.isCurrent,
                'text-gray-500': room.isLocked,
              }"
            >
              {{ room.name.replace('IT ', '') }}
            </div>
          </div>
          <div
            v-if="index < roomProgress.length - 1"
            class="mx-1 text-xs large:text-sm"
            :class="{
              'text-green-400': room.isCompleted,
              'text-dhl-yellow': room.isCurrent,
              'text-gray-600': room.isLocked,
            }"
          >
            →
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-1 mobile:gap-1 sm:gap-2">
      <div
        class="text-sm mobile:text-lg sm:text-xl laptop:text-2xl large:text-3xl font-mono font-bold text-dhl-red bg-black px-1 mobile:px-2 sm:px-2 laptop:px-3 large:px-4 py-0 laptop:py-1 large:py-1 rounded"
      >
        {{ formattedTime }}
      </div>
    </div>
  </header>
</template>
