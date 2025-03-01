<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

defineProps({
  searchQuery: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['open-task-form', 'update:searchQuery'])

const taskStore = useTaskStore()
const isDarkMode = ref(false)

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
}

function updateSearchQuery(event) {
  emit('update:searchQuery', event.target.value)
}
</script>

<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h1 class="text-xl font-bold text-gray-800">TaskFlow</h1>
        </div>
        
        <div class="flex-grow md:mx-4">
          <div class="relative">
            <input 
              type="text" 
              :value="searchQuery"
              @input="updateSearchQuery"
              placeholder="Search tasks..." 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-lg">
            <span class="text-sm font-medium text-gray-600">{{ taskStore.statistics.todo }}</span>
            <span class="text-xs text-gray-500">to do</span>
          </div>
          
          <div class="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-lg">
            <span class="text-sm font-medium text-gray-600">{{ taskStore.statistics.inProgress }}</span>
            <span class="text-xs text-gray-500">in progress</span>
          </div>
          
          <div class="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-lg">
            <span class="text-sm font-medium text-gray-600">{{ taskStore.statistics.completed }}</span>
            <span class="text-xs text-gray-500">completed</span>
          </div>
          
          <button 
            @click="toggleDarkMode" 
            class="p-2 rounded-full hover:bg-gray-100"
            title="Toggle dark mode"
          >
            <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <button 
            @click="$emit('open-task-form')" 
            class="btn btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
      </div>
    </div>
  </header>
</template>