<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from './stores/taskStore'
import TaskColumn from './components/TaskColumn.vue'
import TaskForm from './components/TaskForm.vue'
import AppHeader from './components/AppHeader.vue'
import TaskDetails from './components/TaskDetails.vue'

const taskStore = useTaskStore()
const showTaskForm = ref(false)
const selectedTask = ref(null)
const showTaskDetails = ref(false)
const searchQuery = ref('')

const filteredTasks = computed(() => {
  if (!searchQuery.value) return taskStore.tasks
  
  const query = searchQuery.value.toLowerCase()
  return taskStore.tasks.filter(task => 
    task.title.toLowerCase().includes(query) || 
    task.description.toLowerCase().includes(query)
  )
})

const todoTasks = computed(() => {
  return filteredTasks.value.filter(task => task.status === 'todo')
})

const inProgressTasks = computed(() => {
  return filteredTasks.value.filter(task => task.status === 'inProgress')
})

const completedTasks = computed(() => {
  return filteredTasks.value.filter(task => task.status === 'completed')
})

function openTaskForm() {
  showTaskForm.value = true
}

function closeTaskForm() {
  showTaskForm.value = false
}

function openTaskDetails(task) {
  selectedTask.value = task
  showTaskDetails.value = true
}

function closeTaskDetails() {
  showTaskDetails.value = false
}

onMounted(() => {
  taskStore.loadTasks()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader @open-task-form="openTaskForm" v-model:search-query="searchQuery" />
    
    <main class="flex-grow p-6">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn 
            title="Tasks" 
            :tasks="todoTasks" 
            status="todo"
            @task-click="openTaskDetails" 
          />
          
          <TaskColumn 
            title="In Progress" 
            :tasks="inProgressTasks" 
            status="inProgress"
            @task-click="openTaskDetails" 
          />
          
          <TaskColumn 
            title="Completed" 
            :tasks="completedTasks" 
            status="completed"
            @task-click="openTaskDetails" 
          />
        </div>
      </div>
    </main>
    
    <TaskForm 
      v-if="showTaskForm" 
      @close="closeTaskForm" 
    />
    
    <TaskDetails 
      v-if="showTaskDetails" 
      :task="selectedTask" 
      @close="closeTaskDetails" 
    />
  </div>
</template>