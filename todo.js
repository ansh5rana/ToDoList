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

    // Create an input field with the text of the task
    let input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'editInput'; // Make sure this class is defined in your CSS

    // Replace the task text with the input field
    taskItem.replaceChild(input, taskTextElement);
    input.focus();

    // Function to revert to displaying the task as text
    const revertToText = () => {
        let newText = input.value.trim();
        if (!newText) { // Prevent saving empty task
            newText = originalText; // Revert to original text if new text is empty
        }
        taskTextElement.innerText = newText;
        taskItem.replaceChild(taskTextElement, input);
        saveTasks(); // Update local storage with the new task list
    };

    // Save the edit when the "Enter" key is pressed
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission
            revertToText();
        }
    });

    // Also save the edit when the input loses focus (blur event)
    input.addEventListener('blur', revertToText);
}



function saveEditedTask(taskItem, newText) {
    // Create a new span element with the updated text
    const newSpan = document.createElement('span');
    newSpan.innerText = newText;

    // Find the input element in the task item
    const input = taskItem.querySelector('input.editInput');

    // Re-apply the 'completed' class to the new span if it was previously marked as complete
    if (input && input.nextSibling.querySelector('p').innerText.includes('Mark as Incomplete')) {
        newSpan.classList.add('completed');
    }

    // Replace the input with the new span
    taskItem.replaceChild(newSpan, input);

    // Update the task list in local storage
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
