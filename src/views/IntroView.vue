<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import dhlLogo from '@/assets/dhl_logo2.png'

const gameStore = useGameStore()
const playerStore = usePlayerStore()

// NEW: Local state for form inputs
const firstName = ref('')
const lastName = ref('')
const department = ref('')
const workTime = ref('')

// NEW: State to handle replay prevention
const hasAlreadyPlayed = ref(false)
const finalResult = ref<{ name: string; score: number } | null>(null)

const departments = ['CPU', 'HR', 'Security', 'Operations', 'Finance', 'IT']
const workTimes = ['AM Shift', 'PM Shift', 'Day Time']

// NEW: Computed property to check if form is complete
const isFormValid = computed(() => {
  return (
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
    department.value !== '' &&
    workTime.value !== ''
  )
})

// NEW: Function to handle starting the mission
function handleStartMission() {
  console.log('handleStartMission called')
  console.log('Form is valid:', isFormValid.value)
  console.log('Current game state:', gameStore.gameState)

  if (isFormValid.value) {
    console.log('Setting player info...')
    playerStore.setPlayerInfo({
      firstName: firstName.value,
      lastName: lastName.value,
      department: department.value,
      workTime: workTime.value,
    })
    console.log('Calling startGame...')
    gameStore.startGame()
    console.log('startGame called, new state:', gameStore.gameState)
  } else {
    console.log('Form is not valid!')
  }
}

// NEW: Check for a completed game on component mount
onMounted(() => {
  const completedGame = localStorage.getItem('dhl-it-lockdown-completed-game')
  if (completedGame) {
    hasAlreadyPlayed.value = true
    const data = JSON.parse(completedGame)
    finalResult.value = {
      name: `${data.firstName} ${data.lastName}`,
      score: data.score,
    }
  }
})
</script>
<template>
  <div class="w-full h-screen flex items-center justify-center bg-dhl-yellow text-gray-900 p-8">
    <div class="flex flex-col items-center justify-center max-w-2xl w-full">
      <img :src="dhlLogo" alt="DHL Logo" class="w-64 mb-6" />
      <h1 class="text-5xl font-bold font-delivery text-dhl-red mb-8 text-center">
        The IT Lockdown
      </h1>

      <!-- NEW: Conditional rendering based on play status -->
      <div v-if="hasAlreadyPlayed && finalResult" class="text-center">
        <p class="text-2xl max-w-3xl text-center mb-6">
          Thank you for participating, {{ finalResult.name }}!
        </p>
        <div class="bg-white p-8 rounded-lg shadow-2xl">
          <h2 class="text-2xl font-bold mb-2">Your Final Score</h2>
          <p class="text-5xl font-black text-dhl-red">{{ finalResult.score.toLocaleString() }}</p>
        </div>
        <p class="mt-4 text-gray-700">You can now close this window.</p>
      </div>

      <div v-else class="w-full flex flex-col items-center">
        <p class="text-xl max-w-3xl text-center mb-8">
          Enter your details to begin your mission. You have 60 minutes to escape the IT lockdown.
          Good luck, agent!
        </p>

        <!-- NEW: Registration Form -->
        <div class="w-full max-w-md bg-white/50 p-8 rounded-lg shadow-lg border border-white/20">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-bold text-gray-800 mb-1"
                >First Name</label
              >
              <input
                v-model="firstName"
                id="firstName"
                type="text"
                class="w-full p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red"
              />
            </div>
            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-bold text-gray-800 mb-1"
                >Last Name</label
              >
              <input
                v-model="lastName"
                id="lastName"
                type="text"
                class="w-full p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red"
              />
            </div>
            <!-- Department -->
            <div class="md:col-span-2">
              <label for="department" class="block text-sm font-bold text-gray-800 mb-1"
                >Department</label
              >
              <select
                v-model="department"
                id="department"
                class="w-full p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red"
              >
                <option disabled value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
            <!-- Work Time -->
            <div class="md:col-span-2">
              <label for="workTime" class="block text-sm font-bold text-gray-800 mb-1"
                >Work Time / Shift</label
              >
              <select
                v-model="workTime"
                id="workTime"
                class="w-full p-2 border border-gray-400 rounded-md text-gray-900 focus:ring-dhl-red focus:border-dhl-red"
              >
                <option disabled value="">Select Work Time</option>
                <option v-for="time in workTimes" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
          </div>

          <button
            @click="handleStartMission"
            :disabled="!isFormValid"
            class="w-full bg-dhl-red text-white font-bold py-3 px-8 rounded-lg text-xl mt-6 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-700"
          >
            Begin Mission
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
