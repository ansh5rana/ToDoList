document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('taskInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    if (taskText) {
        createTaskItem(taskText);
        taskInput.value = '';
        saveTasks();
    } else {
        alert('Please enter a task');
    }
}

function createTaskItem(taskText, isCompleted = false) {
    const tasksList = document.getElementById('tasksList');
    const li = document.createElement('li');
    li.className = 'taskItem';
    li.innerHTML = `
      <span ${isCompleted ? 'class="completed"' : ''}>${taskText}</span>
      <div class="menu">
          <div class="dots">&#8226;&#8226;&#8226;</div>
          <div class="menu-content">
              <p onclick="toggleCompletion(this.parentNode.parentNode.parentNode)">Mark as Complete</p>
              <p onclick="editTask(this.parentNode.parentNode.parentNode)">Edit</p>
              <p onclick="deleteTask(this.parentNode.parentNode.parentNode)">Delete</p>
          </div>
      </div>`;
    tasksList.appendChild(li);
}

function toggleCompletion(taskItem) {
    const taskText = taskItem.querySelector('span');
    taskText.classList.toggle('completed');
    saveTasks();
}

function deleteTask(taskItem) {
    taskItem.remove();
    saveTasks();
}

function editTask(taskItem) {
    let taskTextElement = taskItem.querySelector('span');
    let originalText = taskTextElement.innerText;

    let input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'editInput';

    taskItem.replaceChild(input, taskTextElement);
    input.focus();

    const revertToText = () => {
        let newText = input.value.trim();
        if (!newText) { 
            newText = originalText;
        }
        taskTextElement.innerText = newText;
        taskItem.replaceChild(taskTextElement, input);
        saveTasks(); 
    };
    
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            revertToText();
        }
    });
    input.addEventListener('blur', revertToText);
}



function saveEditedTask(taskItem, newText) {
    const newSpan = document.createElement('span');
    newSpan.innerText = newText;
    const input = taskItem.querySelector('input.editInput');
    if (input && input.nextSibling.querySelector('p').innerText.includes('Mark as Incomplete')) {
        newSpan.classList.add('completed');
    }
    taskItem.replaceChild(newSpan, input);
    saveTasks();
}



function saveTasks() {
    const tasksList = document.getElementById('tasksList');
    const tasks = [];
    for (let i = 0; i < tasksList.children.length; i++) {
        const task = tasksList.children[i];
        const text = task.querySelector('span').innerText;
        const completed = task.querySelector('span').classList.contains('completed');
        tasks.push({ text, completed });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskItem(task.text, task.completed);
    });
}
