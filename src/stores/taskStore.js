import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref([]);

  // Load tasks from localStorage
  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks);
      // } else {
      //   // Add sample tasks if no tasks exist
      //   tasks.value = [
      //     {
      //       id: uuidv4(),
      //       title: 'Create project wireframes',
      //       description: 'Design the initial wireframes for the new project',
      //       status: 'todo',
      //       priority: 'high',
      //       createdAt: new Date().toISOString(),
      //       dueDate: null,
      //       tags: ['design', 'planning']
      //     },
      //     {
      //       id: uuidv4(),
      //       title: 'Research competitors',
      //       description: 'Analyze competitor products and identify opportunities',
      //       status: 'inProgress',
      //       priority: 'medium',
      //       createdAt: new Date().toISOString(),
      //       dueDate: null,
      //       tags: ['research', 'marketing']
      //     },
      //     {
      //       id: uuidv4(),
      //       title: 'Update documentation',
      //       description: 'Update the user documentation with the latest features',
      //       status: 'completed',
      //       priority: 'low',
      //       createdAt: new Date().toISOString(),
      //       dueDate: null,
      //       tags: ['documentation']
      //     }
      //   ]
      saveTasks();
    }
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  }

  // Add a new task
  function addTask(task) {
    const newTask = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...task,
    };
    tasks.value.push(newTask);
    saveTasks();
    return newTask;
  }

  // Update an existing task
  function updateTask(updatedTask) {
    const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask };
      saveTasks();
      return true;
    }
    return false;
  }

  // Delete a task
  function deleteTask(taskId) {
    tasks.value = tasks.value.filter((task) => task.id !== taskId);
    saveTasks();
  }

  // Move a task to a different status
  function moveTask(taskId, newStatus) {
    const task = tasks.value.find((task) => task.id === taskId);
    if (task) {
      task.status = newStatus;
      saveTasks();
      return true;
    }
    return false;
  }

  // Get task statistics
  const statistics = computed(() => {
    return {
      total: tasks.value.length,
      todo: tasks.value.filter((task) => task.status === "todo").length,
      inProgress: tasks.value.filter((task) => task.status === "inProgress")
        .length,
      completed: tasks.value.filter((task) => task.status === "completed")
        .length,
    };
  });

  return {
    tasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    statistics,
  };
});
