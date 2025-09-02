<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits(['close'])
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    @click.self="emit('close')"
  >
    <div
      class="bg-gray-900 border-2 border-dhl-yellow rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-2"
    >
      <div class="relative p-6">
        <button
          @click="emit('close')"
          class="absolute top-2 right-2 text-dhl-yellow hover:text-dhl-red text-4xl"
        >
          &times;
        </button>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
