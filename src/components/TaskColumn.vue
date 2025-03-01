<script setup>
import { defineProps, defineEmits } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['task-click'])
const taskStore = useTaskStore()

function handleDrop(event) {
  const taskId = event.dataTransfer.getData('taskId')
  taskStore.moveTask(taskId, props.status)
}

function allowDrop(event) {
  event.preventDefault()
}
</script>

<template>
  <div 
    class="task-column"
    @drop="handleDrop"
    @dragover="allowDrop"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-700">{{ title }}</h2>
      <span class="bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
        {{ tasks.length }}
      </span>
    </div>
    
    <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-gray-500 text-sm">No tasks yet</p>
      <p class="text-gray-400 text-xs">Drag and drop tasks here</p>
    </div>
    
    <div v-else class="space-y-3">
      <TaskCard 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
        @click="$emit('task-click', task)"
      />
    </div>
  </div>
</template>