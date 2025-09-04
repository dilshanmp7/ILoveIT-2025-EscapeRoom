<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LevelId, Room } from '@/types'
import { useRoomStore } from '@/stores/roomStore'
import { usePlayerStore } from '@/stores/playerStore'
import { PUZZLE_DATA } from '@/gameData'

const props = defineProps<{
  levelId: LevelId
  roomId: Room['id']
}>()

const roomStore = useRoomStore()
const playerStore = usePlayerStore()

const status = computed(() => roomStore.levelStatus[props.levelId])
const questions = computed(() => roomStore.questionsForLevels[props.levelId])
const levelData = computed(() => PUZZLE_DATA[props.roomId].levels[props.levelId])

const assignedHint = computed(() => roomStore.currentHints[props.levelId])

// Use the persistent current question index from the store
const currentQuestionIndex = computed({
  get: () => roomStore.currentQuestionIndex[props.levelId],
  set: (value) => roomStore.setCurrentQuestion(props.levelId, value),
})

// Use the persistent correct answers count from the store
const correctAnswers = computed(() => roomStore.correctAnswersCount[props.levelId])

const selectedOption = ref<string | null>(null)
const feedback = ref('')

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

function submitAnswer() {
  if (selectedOption.value === null) return

  if (selectedOption.value === currentQuestion.value.correctOptionId) {
    roomStore.incrementCorrectAnswers(props.levelId)
    console.log(`Correct answer for ${props.levelId}! Count now: ${correctAnswers.value + 1}`)
    feedback.value = 'Correct!'
  } else {
    console.log(`Incorrect answer for ${props.levelId}. Count remains: ${correctAnswers.value}`)
    feedback.value = 'Incorrect.'
    playerStore.applyIncorrectAnswerPenalty()
  }

  // Save state after each answer to persist progress
  roomStore.saveState()

  setTimeout(() => {
    feedback.value = ''
    selectedOption.value = null
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
    } else {
      console.log(`Level ${props.levelId} completed check:`, {
        correctAnswers: correctAnswers.value,
        totalQuestions: questions.value.length,
        isComplete: correctAnswers.value === questions.value.length,
      })
      if (correctAnswers.value === questions.value.length) {
        console.log(`Level ${props.levelId} completed successfully!`)
        roomStore.completeLevel(props.levelId)
      } else {
        console.log(
          `Level ${props.levelId} failed - resetting. Expected: ${questions.value.length}, Got: ${correctAnswers.value}`
        )
        currentQuestionIndex.value = 0
        roomStore.resetCorrectAnswers(props.levelId)
        roomStore.saveState() // Save state after reset
        alert('You did not answer all questions correctly. Resetting this level.')
      }
    }
  }, 1000)
}
</script>
<template>
  <div
    class="w-full sm:w-1/4 h-64 sm:h-3/4 p-4 sm:p-6 rounded-lg border-4 transition-all duration-500 flex flex-col"
    :class="{
      'border-dhl-yellow bg-black/50': status === 'unlocked',
      'border-gray-600 bg-black/30 text-gray-600': status === 'locked',
      'border-green-500 bg-green-900/70': status === 'solved',
    }"
  >
    <h2
      class="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center"
      :class="{ 'text-dhl-yellow': status !== 'locked', 'text-green-400': status === 'solved' }"
    >
      {{ levelData.title }}
    </h2>

    <div v-if="status === 'locked'" class="flex flex-col items-center justify-center flex-1">
      <p class="text-3xl sm:text-5xl">🔒</p>
      <p class="mt-2 text-lg sm:text-xl">LOCKED</p>
    </div>

    <div
      v-if="status === 'solved'"
      class="flex flex-col items-center justify-center flex-1 text-center"
    >
      <p class="text-3xl sm:text-5xl">✅</p>
      <p class="mt-2 text-lg sm:text-xl font-bold text-green-300">LEVEL COMPLETE</p>
      <div v-if="assignedHint" class="mt-2 sm:mt-4 w-full">
        <p class="text-sm sm:text-base">Hint Awarded:</p>
        <p
          class="text-sm sm:text-lg font-mono bg-black p-2 rounded border border-green-500 text-center mt-1 break-words"
        >
          "{{ assignedHint.text }}"
        </p>
      </div>
    </div>

    <div v-if="status === 'unlocked'" class="flex flex-col flex-1 overflow-hidden">
      <p class="text-center mb-2 sm:mb-4 text-sm sm:text-lg">
        Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
      </p>
      <div v-if="currentQuestion" class="flex-1 flex flex-col overflow-hidden">
        <p class="mb-2 sm:mb-4 text-base sm:text-xl">{{ currentQuestion.question }}</p>

        <!-- Scrollable options container for mobile -->
        <div class="space-y-2 sm:space-y-3 flex-1 overflow-y-auto mb-2">
          <div v-for="option in currentQuestion.options" :key="option.id">
            <label
              class="block w-full p-2 sm:p-3 rounded border-2 cursor-pointer text-sm sm:text-base transition-colors touch-manipulation"
              :class="{
                'border-gray-500 hover:bg-gray-700': selectedOption !== option.id,
                'bg-dhl-yellow text-black border-dhl-yellow': selectedOption === option.id,
              }"
            >
              <input type="radio" :value="option.id" v-model="selectedOption" class="hidden" />
              {{ option.text }}
            </label>
          </div>
        </div>

        <div class="mt-auto">
          <button
            @click="submitAnswer"
            :disabled="selectedOption === null"
            class="w-full bg-dhl-red text-white p-3 sm:p-3 rounded font-bold disabled:bg-gray-500 text-sm sm:text-base touch-manipulation"
          >
            Submit Answer
          </button>
          <p class="text-center h-6 mt-2 text-lg sm:text-xl font-bold">{{ feedback }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
