<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Puzzle } from '@/types'
const props = defineProps<{ puzzleData: Puzzle }>()
const emit = defineEmits(['solved'])

const selected = ref<string[]>([])
const feedback = ref('')

function selectElement(id: string) {
  if (!selected.value.includes(id)) {
    selected.value.push(id)
  } else {
    selected.value = selected.value.filter((s) => s !== id)
  }
}

const isSolved = computed(() => {
  return (
    props.puzzleData.solution.every((sol: string) => selected.value.includes(sol)) &&
    selected.value.length === props.puzzleData.solution.length
  )
})

function checkSolution() {
  if (isSolved.value) {
    feedback.value = 'Correct! Malicious elements isolated.'
    setTimeout(() => emit('solved'), 1500)
  } else {
    feedback.value = 'Incorrect. At least one element is not malicious.'
  }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold text-dhl-red mb-2">{{ puzzleData.title }}</h2>
    <p class="text-gray-300 mb-6">{{ puzzleData.description }}</p>
    <div class="bg-white text-black p-4 rounded font-sans">
      <div class="border-b pb-2 mb-2">
        <p>
          <strong>From:</strong>
          <span
            @click="selectElement('bad-sender')"
            :class="{
              'bg-yellow-300 cursor-pointer': !selected.includes('bad-sender'),
              'bg-green-400': selected.includes('bad-sender'),
            }"
            >accounts@dhl-support.co</span
          >
        </p>
        <p><strong>Subject:</strong> Urgent Action Required: Your Account is Locked</p>
      </div>
      <div class="py-2">
        <p>Dear Customer,</p>
        <p class="my-2">
          We have detected suspicious activity on your account. For your security, we have
          temporarily locked it. Please click the link below immediately to verify your identity and
          restore access.
        </p>
        <p
          class="my-2"
          @click="selectElement('bad-link')"
          :class="{
            'bg-yellow-300 cursor-pointer': !selected.includes('bad-link'),
            'bg-green-400': selected.includes('bad-link'),
          }"
        >
          <a>https://dhl-login.restore-access-now.com/verify</a>
        </p>
        <p
          class="my-2"
          @click="selectElement('bad-urgency')"
          :class="{
            'bg-yellow-300 cursor-pointer': !selected.includes('bad-urgency'),
            'bg-green-400': selected.includes('bad-urgency'),
          }"
        >
          Failure to do so within 2 hours will result in permanent account deletion.
        </p>
        <p>Thank you,<br />DHL Security Team</p>
      </div>
    </div>
    <button @click="checkSolution" class="w-full bg-dhl-red text-white p-2 mt-4 rounded font-bold">
      Confirm Selection
    </button>
    <p class="text-center mt-2 h-6">{{ feedback }}</p>
  </div>
</template>
