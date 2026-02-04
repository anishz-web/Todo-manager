
let todos = JSON.parse(localStorage.getItem('todos')) || [];
const listContainer = document.getElementById('todoList');
const inputField = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');


function init() {
    if (todos.length === 0) return;
    
    const fragment = todos.map(todo => generateHTML(todo)).join('');
    listContainer.innerHTML = fragment;
}


function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
}


function generateHTML(todo) {
    
    return `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" 
            data-id="${todo.id}" 
            tabindex="0">
            <input type="checkbox" class="toggle-state" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text" contenteditable="true">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" aria-label="Delete task">&times;</button>
        </li>
    `;
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addTodo(text) {
    if (!text.trim()) return;
    
    const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };

    todos.push(newTodo);
    save();

    
    listContainer.insertAdjacentHTML('beforeend', generateHTML(newTodo));
    inputField.value = '';
}


listContainer.addEventListener('click', (e) => {
    const el = e.target;
    const li = el.closest('li');
    if (!li) return;
    
    const id = Number(li.dataset.id);

    
    if (el.classList.contains('delete-btn')) {
        handleDelete(id, li);
    }
    
   
    if (el.classList.contains('toggle-state')) {
        handleToggle(id, li, el.checked);
    }
});


listContainer.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('todo-text')) {
        const li = e.target.closest('li');
        const id = Number(li.dataset.id);
        const newText = e.target.innerText.trim();
        
       
        const todo = todos.find(t => t.id === id);
        if (todo && newText) {
            todo.text = newText;
            save();
        } else if (!newText) {
            
            e.target.innerText = todo.text;
        }
    }
});


listContainer.addEventListener('keydown', (e) => {
    const li = document.activeElement.closest('li');
    
   
    if (e.key === 'Delete' && li && !e.target.classList.contains('todo-text')) {
        const id = Number(li.dataset.id);
        handleDelete(id, li);
    }

   
    if (e.key === 'Enter' && e.target.classList.contains('todo-text')) {
        e.preventDefault(); 
        e.target.blur();    
    }
});


function handleDelete(id, liElement) {
    todos = todos.filter(t => t.id !== id);
    save();
    liElement.remove(); 
}


function handleToggle(id, liElement, isChecked) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = isChecked;
        save();
   
        if (isChecked) liElement.classList.add('completed');
        else liElement.classList.remove('completed');
    }
}


addBtn.addEventListener('click', () => addTodo(inputField.value));

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo(inputField.value);
});


init();