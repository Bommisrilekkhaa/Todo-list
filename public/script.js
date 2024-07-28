const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task${task.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <span>${task.title}: ${task.description}${task.completed ? '<span class="completed-tag">Completed</span>' : ''}</span>
            <button class="complete" onclick="toggleComplete('${task._id}', ${task.completed})">${task.completed ? '✔️' : 'Complete'}</button>
            <button class="delete" onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, completed: false })
    });
    const newTask = await response.json();
    const li = document.createElement('li');
    li.className = 'task';
    li.innerHTML = `
        <span>${newTask.title}: ${newTask.description}</span>
        <button class="complete" onclick="toggleComplete('${newTask._id}', false)">Complete</button>
        <button class="delete" onclick="deleteTask('${newTask._id}')">Delete</button>
    `;
    taskList.appendChild(li);
    form.reset();
});

window.toggleComplete = async function(id, completed) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
    });
    const updatedTask = await response.json();
    const taskElement = document.querySelector(`.task button[onclick="toggleComplete('${id}', ${completed})"]`).parentElement;
    taskElement.classList.toggle('completed');
    taskElement.querySelector('.complete').innerText = updatedTask.completed ? '✔️' : 'Complete';
    if (updatedTask.completed) {
        taskElement.querySelector('span').innerHTML += '<span class="completed-tag">Completed</span>';
    } else {
        const completedTag = taskElement.querySelector('.completed-tag');
        if (completedTag) {
            completedTag.remove();
        }
    }
};

window.deleteTask = async function(id) {
    await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });
    const taskElement = document.querySelector(`.task button[onclick="deleteTask('${id}')"]`).parentElement;
    taskElement.remove();
};

fetchTasks();
