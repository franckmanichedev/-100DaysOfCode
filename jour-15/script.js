// Éléments DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');
const taskCounter = document.getElementById('taskCounter');

// Charger les tâches au démarrage
document.addEventListener('DOMContentLoaded', loadTasks);

// Ajouter une tâche
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Vider la liste
clearBtn.addEventListener('click', clearTasks);

// Fonction pour ajouter une tâche
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    
    // Créer l'objet tâche
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    // Ajouter à la liste
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    
    // Afficher la tâche
    renderTask(task);
    
    // Réinitialiser l'input
    taskInput.value = '';
    taskInput.focus();
    
    // Mettre à jour le compteur
    updateCounter();
}

// Fonction pour afficher une tâche
function renderTask(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button class="delete-btn">×</button>
    `;
    
    // Ajouter les écouteurs d'événements
    const checkbox = taskItem.querySelector('.task-checkbox');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    
    checkbox.addEventListener('change', () => toggleTask(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    taskList.appendChild(taskItem);
}

// Fonction pour basculer l'état d'une tâche
function toggleTask(id) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        
        // Mettre à jour l'affichage
        const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
        if (taskItem) {
            taskItem.classList.toggle('completed');
            taskItem.querySelector('.task-text').classList.toggle('completed');
        }
        
        updateCounter();
    }
}

// Fonction pour supprimer une tâche
function deleteTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
    
    // Supprimer de l'affichage
    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    if (taskItem) taskItem.remove();
    
    updateCounter();
}

// Fonction pour vider la liste
function clearTasks() {
    if (confirm('Voulez-vous vraiment supprimer toutes les tâches ?')) {
        localStorage.removeItem('tasks');
        taskList.innerHTML = '';
        updateCounter();
    }
}

// Fonction pour charger les tâches
function loadTasks() {
    const tasks = getTasks();
    taskList.innerHTML = '';
    
    if (tasks.length > 0) {
        tasks.forEach(task => renderTask(task));
    }
    
    updateCounter();
}

// Fonction pour obtenir les tâches depuis localStorage
function getTasks() {
    const tasksJSON = localStorage.getItem('tasks');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

// Fonction pour sauvegarder les tâches dans localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction pour mettre à jour le compteur
function updateCounter() {
    const tasks = getTasks();
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    
    taskCounter.textContent = `${completed}/${total} tâche(s) complétée(s)`;
}