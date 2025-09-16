<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { LevelId, Room } from '@/types'
import { useRoomStore } from '@/stores/roomStore'
import { usePlayerStore } from '@/stores/playerStore'
import { PUZZLE_DATA } from '@/gameData'

// --- SCRIPT IS UNCHANGED ---
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

const currentQuestionIndex = computed({
  get: () => roomStore.currentQuestionIndex[props.levelId],
  set: (value) => roomStore.setCurrentQuestion(props.levelId, value),
})

const correctAnswers = computed(() => roomStore.correctAnswersCount[props.levelId])

const selectedOption = ref<string | null>(null)
const feedback = ref('')
const resetMessage = ref('')

const hintUsedForQuestions = ref<Set<number>>(new Set())
const visibleOptions = ref<string[]>([])

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const isHintAvailable = computed(() => {
  return currentQuestion.value && !hintUsedForQuestions.value.has(currentQuestionIndex.value)
})

const initializeVisibleOptions = () => {
  if (currentQuestion.value) {
    visibleOptions.value = currentQuestion.value.options.map((opt: any) => opt.id)
  }
}

function useHint() {
  if (!currentQuestion.value || !isHintAvailable.value) return
  const currentQuestionIdx = currentQuestionIndex.value
  hintUsedForQuestions.value.add(currentQuestionIdx)
  playerStore.deductHintPenalty()
  const totalOptions = currentQuestion.value.options.length
  const optionsToHide = Math.floor(totalOptions / 2)
  if (optionsToHide > 0) {
    const incorrectOptions = currentQuestion.value.options
      .filter((opt: any) => opt.id !== currentQuestion.value.correctOptionId)
      .map((opt: any) => opt.id)
    const optionsToHideIds = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(optionsToHide, incorrectOptions.length))
    visibleOptions.value = currentQuestion.value.options
      .map((opt: any) => opt.id)
      .filter((id: any) => !optionsToHideIds.includes(id))
  }
  feedback.value = `Hint used! ${optionsToHide} option(s) removed. -2 points`
}

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
    feedback.value = 'Correct!'
  } else {
    feedback.value = 'Incorrect.'
    playerStore.applyIncorrectAnswerPenalty()
  }
  roomStore.saveState()
  setTimeout(() => {
    feedback.value = ''
    selectedOption.value = null
    resetMessage.value = ''
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
    } else {
      if (correctAnswers.value === questions.value.length) {
        roomStore.completeLevel(props.levelId)
      } else {
        currentQuestionIndex.value = 0
        hintUsedForQuestions.value.clear()
        roomStore.resetCorrectAnswers(props.levelId)
        roomStore.saveState()
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
    class="w-full h-full p-1 mobile:p-1 sm:p-1 laptop:p-2 large:p-2 rounded-lg border-4 transition-all duration-500 flex flex-col"
    :class="{
      'border-dhl-yellow bg-black/50': status === 'unlocked',
      'border-gray-600 bg-black/30 text-gray-600': status === 'locked',
      'border-green-500 bg-green-900/70': status === 'solved',
    }"
  >
    <h2
      class="text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl font-bold mb-1 mobile:mb-2 sm:mb-2 laptop:mb-3 large:mb-3 text-center leading-normal flex-shrink-0"
      :class="{ 'text-dhl-yellow': status !== 'locked', 'text-green-400': status === 'solved' }"
    >
      {{ levelData.title }}
    </h2>

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

    <div v-if="status === 'unlocked'" class="flex flex-col flex-1 overflow-hidden">
      <div
        class="flex items-center justify-between mb-1 mobile:mb-2 sm:mb-2 laptop:mb-1 large:mb-2 flex-shrink-0"
      >
        <p
          class="text-xs mobile:text-sm sm:text-base laptop:text-lg large:text-xl flex-shrink-0 leading-normal font-medium text-gray-300"
        >
          Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
        </p>
        <button
          v-if="isHintAvailable"
          @click="useHint"
          class="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs mobile:text-sm laptop:text-base rounded-lg font-bold transition-all hover:shadow-lg"
          title="Use hint (-2 points)"
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

      <div class="flex-1 overflow-y-auto pr-2 min-h-0">
        <div v-if="currentQuestion">
          <p
            class="mb-2 mobile:mb-3 sm:mb-3 laptop:mb-2 large:mb-3 text-sm mobile:text-base sm:text-lg laptop:text-xl large:text-2xl leading-relaxed font-medium text-white px-1"
          >
            {{ currentQuestion.question }}
          </p>
          <div class="space-y-1 mobile:space-y-2 sm:space-y-2 laptop:space-y-2 large:space-y-3">
            <label
              v-for="option in currentQuestion.options.filter((opt: any) => visibleOptions.includes(opt.id))"
              :key="option.id"
              class="block w-full px-2 py-2 mobile:px-3 mobile:py-2 sm:px-3 sm:py-3 laptop:px-3 laptop:py-2 large:px-5 large:py-4 rounded-lg border-2 cursor-pointer text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl transition-all touch-manipulation leading-relaxed font-medium hover:shadow-lg"
              :class="{
                /* FIX: Added `text-gray-200` to explicitly set the font color for unselected options,
                  matching your original design.
                */
                'border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-400':
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
      </div>

      <div class="flex-shrink-0 pt-2">
        <button
          @click="submitAnswer"
          :disabled="selectedOption === null"
          class="w-full bg-dhl-red hover:bg-red-600 disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white px-3 py-2 mobile:px-4 mobile:py-3 sm:px-4 sm:py-3 laptop:px-4 laptop:py-3 large:px-6 large:py-5 rounded-lg font-bold text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl touch-manipulation min-h-[40px] mobile:min-h-[44px] laptop:min-h-[40px] large:min-h-[48px] transition-all hover:shadow-lg"
        >
          Submit Answer
        </button>
        <p
          class="text-center h-4 mobile:h-5 sm:h-6 laptop:h-5 large:h-7 text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl font-bold leading-normal"
        >
          {{ feedback }}
        </p>
        <div
          v-if="resetMessage"
          class="mt-1 mobile:mt-2 laptop:mt-1 large:mt-3 px-3 py-2 mobile:px-4 mobile:py-3 laptop:px-4 laptop:py-2 large:px-6 large:py-4 bg-red-600 text-white text-center text-sm mobile:text-base sm:text-lg laptop:text-base large:text-xl rounded-lg border-2 border-red-400 animate-pulse leading-normal font-medium"
        >
          {{ resetMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
