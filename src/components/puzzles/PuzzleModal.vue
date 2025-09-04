<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits(['close'])
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-gray-900 border-2 border-dhl-yellow rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div class="relative p-4 sm:p-6">
        <!-- Mobile-optimized close button -->
        <button
          @click="emit('close')"
          class="absolute top-2 right-2 text-dhl-yellow hover:text-dhl-red text-3xl sm:text-4xl z-10 w-10 h-10 flex items-center justify-center touch-manipulation"
          aria-label="Close puzzle"
        >
          &times;
        </button>

        <!-- Content slot with mobile padding -->
        <div class="pr-8 sm:pr-0">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
