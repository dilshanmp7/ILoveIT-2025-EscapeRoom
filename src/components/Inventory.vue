<script setup lang="ts">
import { usePlayerStore } from '@/stores/playerStore'
const playerStore = usePlayerStore()
</script>

<template>
  <div class="flex items-center justify-center gap-4 h-28">
    <div v-if="playerStore.inventory.length === 0" class="text-gray-500">Inventory is empty</div>
    <div
      v-for="item in playerStore.inventory"
      :key="item.id"
      class="bg-gray-800/70 border-2 border-dhl-yellow rounded-lg p-2 w-24 h-24 flex items-center justify-center"
      :title="item.name"
    >
      <img :src="item.image" :alt="item.name" class="max-w-full max-h-full object-contain" />
    </div>
  </div>
</template>
