<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
const resetMessage = ref('')

// Hint system - track hint usage per question in this level
const hintUsedForQuestions = ref<Set<number>>(new Set())
const visibleOptions = ref<string[]>([])

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// Check if hint is available for current question
const isHintAvailable = computed(() => {
  return currentQuestion.value && !hintUsedForQuestions.value.has(currentQuestionIndex.value)
})

// Initialize visible options when question changes
const initializeVisibleOptions = () => {
  if (currentQuestion.value) {
    visibleOptions.value = currentQuestion.value.options.map((opt: any) => opt.id)
  }
}

// Use hint function
function useHint() {
  if (!currentQuestion.value || !isHintAvailable.value) return

  const currentQuestionIdx = currentQuestionIndex.value
  hintUsedForQuestions.value.add(currentQuestionIdx)

  // Deduct 3 points from score
  playerStore.deductHintPenalty()

  // Calculate how many options to hide (50%)
  const totalOptions = currentQuestion.value.options.length
  const optionsToHide = Math.floor(totalOptions / 2)

  if (optionsToHide > 0) {
    // Get incorrect options (exclude the correct answer)
    const incorrectOptions = currentQuestion.value.options
      .filter((opt: any) => opt.id !== currentQuestion.value.correctOptionId)
      .map((opt: any) => opt.id)

    // Randomly select options to hide from incorrect ones
    const optionsToHideIds = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(optionsToHide, incorrectOptions.length))

    // Update visible options
    visibleOptions.value = currentQuestion.value.options
      .map((opt: any) => opt.id)
      .filter((id: any) => !optionsToHideIds.includes(id))
  }

  feedback.value = `Hint used! ${optionsToHide} option(s) removed. -3 points`
}

// Watch for question changes to initialize visible options
watch(
  currentQuestion,
  () => {
    initializeVisibleOptions()
  },
  { immediate: true }
)

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
    resetMessage.value = '' // Clear reset message when moving to next question
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      // Reset will happen automatically via watch
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
        // Reset hint usage for this level
        hintUsedForQuestions.value.clear()
        roomStore.resetCorrectAnswers(props.levelId)
        roomStore.saveState() // Save state after reset

        // Mobile-friendly notification instead of alert
        resetMessage.value = 'Not all questions correct. Level reset!'
        setTimeout(() => {
          resetMessage.value = ''
        }, 4000)
      }
    }
  }, 1000)
}
</script>
<template>
  <div
    class="w-full sm:w-1/4 laptop:w-[30%] large:w-[28%] p-1 mobile:p-1 sm:p-1 laptop:p-2 large:p-2 rounded-lg border-4 transition-all duration-500 flex flex-col"
    :class="{
      'border-dhl-yellow bg-black/50': status === 'unlocked',
      'border-gray-600 bg-black/30 text-gray-600': status === 'locked',
      'border-green-500 bg-green-900/70': status === 'solved',
    }"
    :style="{
      height: 'calc(100% - 90px)',
      maxHeight: 'calc(100% - 90px)',
      minHeight: '400px',
      overflow: 'hidden',
      boxSizing: 'border-box',
      margin: '0',
    }"
  >
    <!-- Enhanced title with better spacing for readability -->
    <h2
      class="text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl font-bold mb-1 mobile:mb-2 sm:mb-2 laptop:mb-3 large:mb-3 text-center leading-normal"
      :class="{ 'text-dhl-yellow': status !== 'locked', 'text-green-400': status === 'solved' }"
    >
      {{ levelData.title }}
    </h2>

    <!-- Locked state - better proportions and spacing -->
    <div
      v-if="status === 'locked'"
      class="flex flex-col items-center justify-center flex-1 min-h-[60px] mobile:min-h-[80px] laptop:min-h-[100px] large:min-h-[120px] space-y-2"
    >
      <p class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl">🔒</p>
      <p
        class="text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl font-semibold tracking-wide"
      >
        LOCKED
      </p>
    </div>

    <!-- Solved state - enhanced with better spacing -->
    <div
      v-if="status === 'solved'"
      class="flex flex-col items-center justify-center flex-1 text-center min-h-[60px] mobile:min-h-[80px] laptop:min-h-[100px] large:min-h-[120px] space-y-2"
    >
      <p class="text-xl mobile:text-2xl sm:text-3xl laptop:text-4xl large:text-5xl">✅</p>
      <p
        class="text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl font-bold text-green-300 tracking-wide"
      >
        LEVEL COMPLETE
      </p>
      <div
        v-if="assignedHint"
        class="mt-3 mobile:mt-4 sm:mt-4 laptop:mt-5 large:mt-6 w-full space-y-2"
      >
        <p
          class="text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl font-semibold text-gray-300"
        >
          Hint Awarded:
        </p>
        <p
          class="text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl font-mono bg-black px-2 py-2 mobile:px-3 mobile:py-2 sm:px-3 sm:py-3 laptop:px-4 laptop:py-3 large:px-5 large:py-4 rounded-lg border border-green-500 text-center leading-relaxed break-words"
        >
          "{{ assignedHint.text }}"
        </p>
      </div>
    </div>

    <!-- Active quiz state - optimized spacing for laptop visibility -->
    <div
      v-if="status === 'unlocked'"
      class="flex flex-col flex-1 overflow-hidden space-y-1 laptop:space-y-1 large:space-y-2"
    >
      <!-- Question counter with laptop-optimized spacing -->
      <div
        class="flex items-center justify-between mb-1 mobile:mb-2 sm:mb-2 laptop:mb-1 large:mb-2"
      >
        <p
          class="text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl flex-shrink-0 leading-normal font-medium text-gray-300"
        >
          Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
        </p>

        <!-- Hint Icon -->
        <button
          v-if="isHintAvailable"
          @click="useHint"
          class="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs mobile:text-sm laptop:text-base rounded-lg font-bold transition-all hover:shadow-lg"
          title="Use hint (-3 points)"
        >
          💡 Hint
        </button>
        <div
          v-else
          class="ml-2 px-2 py-1 bg-gray-500 text-gray-400 text-xs mobile:text-sm laptop:text-base rounded-lg font-bold"
        >
          💡 Used
        </div>
      </div>

      <div
        v-if="currentQuestion"
        class="flex-1 flex flex-col overflow-hidden space-y-1 laptop:space-y-1 large:space-y-2"
      >
        <!-- Question text with laptop-optimized spacing -->
        <p
          class="mb-2 mobile:mb-3 sm:mb-3 laptop:mb-2 large:mb-3 text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl leading-relaxed flex-shrink-0 font-medium text-white px-1"
        >
          {{ currentQuestion.question }}
        </p>

        <!-- Options container with dynamic spacing based on hint usage -->
        <div
          class="space-y-1 mobile:space-y-2 sm:space-y-2 laptop:space-y-2 large:space-y-3 overflow-y-auto min-h-0 flex-shrink-0 transition-all"
          :class="{
            'mb-4 mobile:mb-5 sm:mb-5 laptop:mb-4 large:mb-6':
              !hintUsedForQuestions.has(currentQuestionIndex),
            'mb-2 mobile:mb-3 sm:mb-3 laptop:mb-3 large:mb-4':
              hintUsedForQuestions.has(currentQuestionIndex),
          }"
        >
          <div
            v-for="option in currentQuestion.options.filter((opt: any) => visibleOptions.includes(opt.id))"
            :key="option.id"
          >
            <label
              class="block w-full px-2 py-2 mobile:px-3 mobile:py-2 sm:px-3 sm:py-3 laptop:px-3 laptop:py-2 large:px-5 large:py-4 rounded-lg border-2 cursor-pointer text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl transition-all touch-manipulation leading-relaxed font-medium hover:shadow-lg"
              :class="{
                'border-gray-500 hover:bg-gray-700 hover:border-gray-400':
                  selectedOption !== option.id,
                'bg-dhl-yellow text-black border-dhl-yellow shadow-lg':
                  selectedOption === option.id,
              }"
            >
              <input type="radio" :value="option.id" v-model="selectedOption" class="hidden" />
              {{ option.text }}
            </label>
          </div>
        </div>

        <!-- Submit area with dynamic spacing based on hint usage -->
        <div
          class="flex-shrink-0 space-y-1 laptop:space-y-1 large:space-y-2 transition-all"
          :class="{
            'pt-3 mobile:pt-4 sm:pt-5 laptop:pt-[30px] large:pt-[30px]':
              !hintUsedForQuestions.has(currentQuestionIndex),
            'pt-2 mobile:pt-3 sm:pt-4 laptop:pt-5 large:pt-6':
              hintUsedForQuestions.has(currentQuestionIndex),
          }"
        >
          <button
            @click="submitAnswer"
            :disabled="selectedOption === null"
            class="w-full bg-dhl-red hover:bg-red-600 disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white px-3 py-2 mobile:px-4 mobile:py-3 sm:px-4 sm:py-3 laptop:px-4 laptop:py-3 large:px-6 large:py-5 rounded-lg font-bold text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl touch-manipulation min-h-[40px] mobile:min-h-[44px] laptop:min-h-[40px] large:min-h-[48px] transition-all hover:shadow-lg"
          >
            Submit Answer
          </button>

          <!-- Feedback with laptop-optimized height -->
          <p
            class="text-center h-4 mobile:h-5 sm:h-6 laptop:h-5 large:h-7 text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl font-bold leading-normal"
          >
            {{ feedback }}
          </p>

          <!-- Reset notification with laptop-optimized spacing -->
          <div
            v-if="resetMessage"
            class="mt-1 mobile:mt-2 laptop:mt-1 large:mt-3 px-3 py-2 mobile:px-4 mobile:py-3 laptop:px-4 laptop:py-2 large:px-6 large:py-4 bg-red-600 text-white text-center text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl rounded-lg border-2 border-red-400 animate-pulse leading-normal font-medium"
          >
            {{ resetMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
