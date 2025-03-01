<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const emit = defineEmits(['close'])
const taskStore = useTaskStore()

const task = ref({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: null,
  tags: []
})

const tagInput = ref('')
const errors = ref({})

function addTag() {
  if (tagInput.value.trim() && !task.value.tags.includes(tagInput.value.trim())) {
    task.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

function removeTag(tag) {
  task.value.tags = task.value.tags.filter(t => t !== tag)
}

function validateForm() {
  errors.value = {}
  
  if (!task.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!task.value.description.trim()) {
    errors.value.description = 'Description is required'
  }
  
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validateForm()) return
  
  taskStore.addTask(task.value)
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Add New Task</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-4">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            id="title" 
            v-model="task.title" 
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            :class="{ 'border-red-500': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>
        
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            id="description" 
            v-model="task.description" 
            rows="3" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            :class="{ 'border-red-500': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              id="status" 
              v-model="task.status" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select 
              id="priority" 
              v-model="task.priority" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div class="mb-4">
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
          <input 
            id="dueDate" 
            v-model="task.dueDate" 
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div class="flex">
            <input 
              v-model="tagInput" 
              @keydown.enter.prevent="addTag"
              type="text" 
              placeholder="Add a tag and press Enter" 
              class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <button 
              type="button" 
              @click="addTag" 
              class="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          
          <div class="flex flex-wrap gap-2 mt-2">
            <div 
              v-for="tag in task.tags" 
              :key="tag"
              class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {{ tag }}
              <button 
                type="button" 
                @click="removeTag(tag)" 
                class="ml-1 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  </div>
</template>