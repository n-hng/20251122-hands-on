const newTodoInput = document.getElementById('newTodoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const todoList = document.getElementById('todoList');

// Load todos on startup
fetchTodos();

addTodoBtn.addEventListener('click', addTodo);
newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
clearAllBtn.addEventListener('click', clearAllTodos);

async function fetchTodos() {
    try {
        // Add timestamp to prevent browser caching
        const response = await fetch(`/todos?t=${Date.now()}`);
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function addTodo() {
    const title = newTodoInput.value.trim();
    if (!title) return;

    try {
        await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        newTodoInput.value = '';
        await fetchTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(id, completed) {
    try {
        await fetch(`/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !completed })
        });
        await fetchTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    
    try {
        await fetch(`/todos/${id}`, {
            method: 'DELETE'
        });
        await fetchTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

async function clearAllTodos() {
    if (!confirm('Are you sure you want to delete ALL todos? This cannot be undone.')) return;

    try {
        await fetch('/todos', {
            method: 'DELETE'
        });
        await fetchTodos();
    } catch (error) {
        console.error('Error clearing todos:', error);
    }
}

function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id, todo.completed));

        const span = document.createElement('span');
        span.textContent = todo.title;
        span.addEventListener('click', () => toggleTodo(todo.id, todo.completed));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent toggling when clicking delete
            deleteTodo(todo.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}
