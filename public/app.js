const newTodoInput = document.getElementById('newTodoInput');
const newTodoDueDate = document.getElementById('newTodoDueDate');
const addTodoBtn = document.getElementById('addTodoBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const sortSelect = document.getElementById('sortSelect');

// Load settings
const savedFontSize = localStorage.getItem('fontSize') || 'medium';
fontSizeSelect.value = savedFontSize;
applyFontSize(savedFontSize);

const savedSortOrder = localStorage.getItem('sortOrder') || 'dueAsc';
sortSelect.value = savedSortOrder;

// Load todos on startup
fetchTodos();

addTodoBtn.addEventListener('click', addTodo);
newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});
clearAllBtn.addEventListener('click', clearAllTodos);

fontSizeSelect.addEventListener('change', (e) => {
    const size = e.target.value;
    localStorage.setItem('fontSize', size);
    applyFontSize(size);
});

sortSelect.addEventListener('change', (e) => {
    const sort = e.target.value;
    localStorage.setItem('sortOrder', sort);
    fetchTodos(); // Re-render (fetchTodos calls renderTodos)
});

function applyFontSize(size) {
    let pixelSize;
    switch(size) {
        case 'small': pixelSize = '14px'; break;
        case 'large': pixelSize = '20px'; break;
        case 'medium':
        default: pixelSize = '16px'; break;
    }
    todoList.style.setProperty('--list-font-size', pixelSize);
}

async function fetchTodos() {
    try {
        // Add timestamp to prevent browser caching
        const response = await fetch(`/todos?t=${Date.now()}`);
        let todos = await response.json();
        
        // Sort todos based on current selection
        const sortOrder = sortSelect.value;
        todos.sort((a, b) => {
            if (sortOrder === 'dueAsc') {
                // Earliest deadline first. No deadline -> Last.
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortOrder === 'dueDesc') {
                // Latest deadline first. No deadline -> Last.
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate) - new Date(a.dueDate);
            } else if (sortOrder === 'createdAsc') {
                // Oldest created first
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            } else if (sortOrder === 'createdDesc') {
                // Newest created first
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
            return 0;
        });

        renderTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function addTodo() {
    const title = newTodoInput.value.trim();
    const dueDate = newTodoDueDate.value;

    if (!title) return;

    try {
        await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, dueDate })
        });
        newTodoInput.value = '';
        newTodoDueDate.value = '';
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
    
    if (todos.length === 0) {
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        // Check deadline
        if (todo.dueDate && !todo.completed) {
            const now = new Date();
            const due = new Date(todo.dueDate);
            const diffMs = due - now;
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffMs < 0) {
                li.classList.add('expired');
            } else if (diffHours < 1) {
                li.classList.add('warning');
            } else if (diffHours < 24) {
                li.classList.add('notice');
            }
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id, todo.completed));

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';
        contentDiv.addEventListener('click', () => toggleTodo(todo.id, todo.completed));

        const titleSpan = document.createElement('span');
        titleSpan.textContent = todo.title;
        titleSpan.className = 'todo-title';

        contentDiv.appendChild(titleSpan);

        if (todo.quote) {
            const quoteDiv = document.createElement('div');
            quoteDiv.className = 'todo-quote';
            quoteDiv.textContent = `${todo.quote} — ${todo.quoteAuthor}`;
            contentDiv.appendChild(quoteDiv);
        }

        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-date';
        if (todo.createdAt) {
            const date = new Date(todo.createdAt);
            dateSpan.textContent = date.toLocaleString('ja-JP', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            dateSpan.textContent = '-';
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent toggling when clicking delete
            deleteTodo(todo.id);
        });

        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        if (todo.dueDate) {
            const due = new Date(todo.dueDate);
            const dueSpan = document.createElement('span');
            dueSpan.className = 'todo-date';
            dueSpan.style.fontWeight = 'bold';
            dueSpan.textContent = 'Due: ' + due.toLocaleString('ja-JP', { 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            li.appendChild(dueSpan);
        }

        li.appendChild(dateSpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}
