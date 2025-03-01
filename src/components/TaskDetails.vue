<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const taskStore = useTaskStore()
const isEditing = ref(false)
const editedTask = ref({ ...props.task })
const tagInput = ref('')

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const statusLabel = computed(() => {
  return statusOptions.find(option => option.value === props.task.status)?.label
})

const priorityLabel = computed(() => {
  return priorityOptions.find(option => option.value === props.task.priority)?.label
})

function formatDate(dateString) {
  if (!dateString) return 'No due date'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric' 
  }).format(date)
}

function toggleEdit() {
  isEditing.value = !isEditing.value
  editedTask.value = { ...props.task }
}

function addTag() {
  if (tagInput.value.trim() && !editedTask.value.tags.includes(tagInput.value.trim())) {
    editedTask.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

function removeTag(tag) {
  editedTask.value.tags = editedTask.value.tags.filter(t => t !== tag)
}

function saveChanges() {
  taskStore.updateTask(editedTask.value)
  isEditing.value = false
}

function deleteTask() {
  if (confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(props.task.id)
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 v-if="!isEditing" class="text-xl font-semibold text-gray-800">Task Details</h2>
        <h2 v-else class="text-xl font-semibold text-gray-800">Edit Task</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-4 overflow-y-auto flex-grow">
        <!-- View Mode -->
        <div v-if="!isEditing">
          <div class="mb-6">
            <h3 class="text-2xl font-semibold text-gray-800 mb-2">{{ task.title }}</h3>
            <p class="text-gray-600 whitespace-pre-line">{{ task.description }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <div 
                :class="{
                  'bg-blue-100 text-blue-800': task.status === 'todo',
                  'bg-yellow-100 text-yellow-800': task.status === 'inProgress',
                  'bg-green-100 text-green-800': task.status === 'completed'
                }"
                class="inline-block px-2.5 py-0.5 rounded-full text-sm font-medium"
              >
                {{ statusLabel }}
              </div>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Priority</h4>
              <div 
                :class="{
                  'bg-red-100 text-red-800': task.priority === 'high',
                  'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                  'bg-green-100 text-green-800': task.priority === 'low'
                }"
                class="inline-block px-2.5 py-0.5 rounded-full text-sm font-medium"
              >
                {{ priorityLabel }}
              </div>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Created</h4>
              <p class="text-gray-700">{{ formatDate(task.createdAt) }}</p>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
              <p class="text-gray-700">{{ formatDate(task.dueDate) }}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Tags</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in task.tags" 
                :key="tag"
                class="bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full text-sm"
              >
                {{ tag }}
              </span>
              <span v-if="task.tags.length === 0" class="text-gray-500 text-sm">No tags</span>
            </div>
          </div>
        </div>
        
        <!-- Edit Mode -->
        <div v-else>
          <div class="mb-4">
            <label for="edit-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              id="edit-title" 
              v-model="editedTask.title" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div class="mb-4">
            <label for="edit-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              id="edit-description" 
              v-model="editedTask.description" 
              rows="4" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label for="edit-status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                id="edit-status" 
                v-model="editedTask.status" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            
            <div>
              <label for="edit-priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                id="edit-priority" 
                v-model="editedTask.priority" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="mb-4">
            <label for="edit-dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
            <input 
              id="edit-dueDate" 
              v-model="editedTask.dueDate" 
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
                v-for="tag in editedTask.tags" 
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
        </div>
      </div>
      
      <div class="p-4 border-t flex justify-between">
        <div>
          <button 
            v-if="!isEditing"
            @click="deleteTask" 
            class="btn btn-danger"
          >
            Delete
          </button>
        </div>
        
        <div class="flex space-x-3">
          <button 
            v-if="isEditing"
            @click="toggleEdit" 
            class="btn btn-secondary"
          >
            Cancel
          </button>
          
          <button 
            v-if="!isEditing"
            @click="toggleEdit" 
            class="btn btn-primary"
          >
            Edit
          </button>
          
          <button 
            v-else
            @click="saveChanges" 
            class="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>