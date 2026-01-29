//CONFIGURATION
const STORAGE_KEY = 'todoTasks';
const MAX_TASK_LENGTH = 100;

const taskInput = document.querySelector("#taskInput");
const taskForm = document.querySelector("#taskForm");
const taskList = document.querySelector("#taskList");

//STORAGE LAYER
const Storage = {
    get() {
        try {
            const tasks = localStorage.getItem(STORAGE_KEY);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    },
    
    save(tasks) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Error saving tasks:', error);
            alert('Failed to save task. Storage might be full.');
            return false;
        }
    },
    
    clear() {
        localStorage.removeItem(STORAGE_KEY);
    }
};

//TASK MANAGER
const TaskManager = {
    tasks: [],
    
    init() {
        this.tasks = Storage.get();
        this.render();
    },
    
    add(text) {
        const trimmedText = text.trim();
        
        if (!trimmedText) {
            this.showError('Please enter a task!');
            return false;
        }
        
        if (trimmedText.length > MAX_TASK_LENGTH) {
            this.showError(`Task must be under ${MAX_TASK_LENGTH} characters!`);
            return false;
        }
        
        this.tasks.push(trimmedText);
        
        if (Storage.save(this.tasks)) {
            this.render();
            return true;
        }
        return false;
    },
    
    delete(index) {
        this.tasks.splice(index, 1);
        Storage.save(this.tasks);
        this.render();
    },
    
    render() {
        taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        this.tasks.forEach((taskText, index) => {
            const li = this.createTaskElement(taskText, index);
            taskList.appendChild(li);
        });
    },
    
    createTaskElement(text, index) {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'deleteBtn';
        deleteBtn.textContent = '×';
        deleteBtn.setAttribute('aria-label', `Delete task: ${text}`);
        deleteBtn.addEventListener('click', () => this.delete(index));
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        return li;
    },
    
    renderEmptyState() {
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = 'No tasks yet. Add one above!';
        taskList.appendChild(li);
    },
    
    showError(message) {
        // You could make this fancier with a toast notification
        alert(message);
    }
};

//EVENT HANDLERS
function handleSubmit(e) {
    e.preventDefault();
    
    if (TaskManager.add(taskInput.value)) {
        taskInput.value = '';
        taskInput.focus();
    }
}

//INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    TaskManager.init();
    taskInput.focus();
});

taskForm.addEventListener('submit', handleSubmit);