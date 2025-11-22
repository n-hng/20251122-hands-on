import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { TodoStore } from './store';

const app = express();
const port = 3000;
const store = new TodoStore();

app.use(express.json());
app.use(express.static('public'));

// GET /todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await store.getAll();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// POST /todos
app.post('/todos', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }

        if (title.length > 30) {
            res.status(400).json({ error: 'Title must be 30 characters or less' });
            return;
        }

        const newTodo = {
            id: uuidv4(),
            title,
            completed: false
        };

        await store.add(newTodo);
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// PUT /todos/:id
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        if (title && title.length > 30) {
            res.status(400).json({ error: 'Title must be 30 characters or less' });
            return;
        }

        const updatedTodo = await store.update(id, { title, completed });

        if (!updatedTodo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// DELETE /todos (Delete all)
app.delete('/todos', async (req, res) => {
    try {
        await store.deleteAll();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete all todos' });
    }
});

// DELETE /todos/:id
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await store.delete(id);

        if (!success) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
