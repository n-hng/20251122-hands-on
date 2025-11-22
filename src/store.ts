import fs from 'fs/promises';
import path from 'path';

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt?: string;
    quote?: string;
    quoteAuthor?: string;
    dueDate?: string;
}

const DATA_FILE = path.join(__dirname, '../todos.json');

export class TodoStore {
    
    private async readData(): Promise<Todo[]> {
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // If file doesn't exist, return empty array
            if ((error as any).code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    private async writeData(todos: Todo[]): Promise<void> {
        await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
    }

    async getAll(): Promise<Todo[]> {
        return await this.readData();
    }

    async add(todo: Todo): Promise<void> {
        const todos = await this.readData();
        todos.push(todo);
        await this.writeData(todos);
    }

    async update(id: string, updates: Partial<Omit<Todo, 'id'>>): Promise<Todo | null> {
        const todos = await this.readData();
        const index = todos.findIndex(t => t.id === id);
        
        if (index === -1) {
            return null;
        }

        const currentTodo = todos[index];
        const updatedTodo: Todo = {
            ...currentTodo,
            ...updates
        };

        todos[index] = updatedTodo;
        await this.writeData(todos);
        return updatedTodo;
    }

    async delete(id: string): Promise<boolean> {
        const todos = await this.readData();
        const filteredTodos = todos.filter(t => t.id !== id);
        
        if (todos.length === filteredTodos.length) {
            return false;
        }

        await this.writeData(filteredTodos);
        return true;
    }

    async deleteAll(): Promise<void> {
        await this.writeData([]);
    }
}
