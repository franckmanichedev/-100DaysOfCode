// Éléments DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');
const taskCounter = document.getElementById('taskCounter');
const filterButtons = document.querySelectorAll('.filter-btn');

// Variables d'état
let currentFilter = 'all';
let editingTaskId = null;

// Charger les tâches au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateCounter();
});

// Écouteurs d'événements
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', clearCompletedTasks);

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        filterTasks(currentFilter);
    });
});

// Fonction pour ajouter une tâche
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    
    if (editingTaskId) {
        // Mettre à jour la tâche existante
        updateTask(editingTaskId, taskText);
        editingTaskId = null;
        addBtn.textContent = 'Ajouter';
    } else {
        // Créer une nouvelle tâche
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        
        if (currentFilter === 'all' || currentFilter === 'active') {
            renderTask(task);
        }
    }
    
    taskInput.value = '';
    taskInput.focus();
    updateCounter();
}

// Fonction pour afficher une tâche
function renderTask(task) {
    if ((currentFilter === 'active' && task.completed) || 
        (currentFilter === 'completed' && !task.completed)) {
        return;
    }
    
    const taskItem = document.createElement('li');
    taskItem.className = `task-item animate__animated animate__fadeIn ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;
    
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">×</button>
        </div>
    `;
    
    // Ajouter les écouteurs d'événements
    const checkbox = taskItem.querySelector('.task-checkbox');
    const editBtn = taskItem.querySelector('.edit-btn');
    const deleteBtn = taskItem.querySelector('.delete-btn');
    const taskText = taskItem.querySelector('.task-text');
    
    checkbox.addEventListener('change', () => toggleTask(task.id));
    editBtn.addEventListener('click', () => startEditingTask(task.id, taskText));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    taskText.addEventListener('click', () => toggleTask(task.id));
    
    taskList.appendChild(taskItem);
}

// Fonction pour commencer l'édition d'une tâche
function startEditingTask(id, element) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        editingTaskId = id;
        taskInput.value = task.text;
        taskInput.focus();
        addBtn.textContent = 'Modifier';
        element.classList.add('editing');
    }
}

// Fonction pour mettre à jour une tâche
function updateTask(id, newText) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        saveTasks(tasks);
        
        // Mettre à jour l'affichage
        const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
        if (taskItem) {
            taskItem.querySelector('.task-text').textContent = newText;
            taskItem.querySelector('.task-text').classList.remove('editing');
        }
    }
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
            
            // Si on filtre et que la tâche ne correspond plus au filtre, l'enlever
            if ((currentFilter === 'active' && tasks[taskIndex].completed) || 
                (currentFilter === 'completed' && !tasks[taskIndex].completed)) {
                animateRemoveTask(taskItem);
            }
        }
        
        updateCounter();
    }
}

// Fonction pour supprimer une tâche
function deleteTask(id) {
    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    if (taskItem) {
        animateRemoveTask(taskItem, () => {
            const tasks = getTasks().filter(task => task.id !== id);
            saveTasks(tasks);
            updateCounter();
        });
    }
}

// Animation de suppression
function animateRemoveTask(taskItem, callback) {
    taskItem.classList.add('animate-out');
    taskItem.addEventListener('animationend', () => {
        taskItem.remove();
        if (callback) callback();
    });
}

// Fonction pour filtrer les tâches
function filterTasks(filter) {
    const tasks = getTasks();
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        showEmptyState();
        return;
    }
    
    let filteredTasks = tasks;
    
    if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        showEmptyState();
    } else {
        filteredTasks.forEach(task => renderTask(task));
    }
}

// Afficher l'état vide
function showEmptyState() {
    taskList.innerHTML = `
        <div class="empty-state animate__animated animate__fadeIn">
            Aucune tâche ${currentFilter === 'active' ? 'active' : currentFilter === 'completed' ? 'complétée' : ''}
        </div>
    `;
}

// Fonction pour supprimer les tâches complétées
function clearCompletedTasks() {
    const tasks = getTasks().filter(task => !task.completed);
    saveTasks(tasks);
    
    // Supprimer visuellement les tâches complétées
    document.querySelectorAll('.task-item.completed').forEach(item => {
        animateRemoveTask(item);
    });
    
    updateCounter();
}

// Fonction pour charger les tâches
function loadTasks() {
    const tasks = getTasks();
    taskList.innerHTML = '';
    
    if (tasks.length > 0) {
        tasks.forEach(task => {
            if (currentFilter === 'all' || 
                (currentFilter === 'active' && !task.completed) || 
                (currentFilter === 'completed' && task.completed)) {
                renderTask(task);
            }
        });
    } else {
        showEmptyState();
    }
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
    const activeTasks = tasks.filter(task => !task.completed).length;
    
    taskCounter.textContent = `${activeTasks} tâche(s) restante(s)`;
}