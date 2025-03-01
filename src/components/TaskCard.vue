<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

function handleDragStart(event) {
  event.dataTransfer.setData('taskId', props.task.id)
}
</script>

<template>
  <div 
    :class="['task-card', `priority-${task.priority}`]"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-medium text-gray-800">{{ task.title }}</h3>
      <div 
        :class="{
          'bg-red-100 text-red-800': task.priority === 'high',
          'bg-yellow-100 text-yellow-800': task.priority === 'medium',
          'bg-green-100 text-green-800': task.priority === 'low'
        }"
        class="text-xs font-medium px-2.5 py-0.5 rounded-full"
      >
        {{ task.priority }}
      </div>
    </div>
    
    <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ task.description }}</p>
    
    <div class="flex justify-between items-center">
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="tag in task.tags" 
          :key="tag"
          class="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded"
        >
          {{ tag }}
        </span>
      </div>
      
      <div v-if="task.dueDate" class="text-xs text-gray-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(task.dueDate) }}
      </div>
    </div>
  </div>
</template>