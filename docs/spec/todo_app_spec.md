# Todo Application Specification

## 1. Overview
This document specifies the requirements for a Todo List application built with Node.js, TypeScript, and Express. The application provides a REST API for managing tasks and a static web frontend for user interaction. Data is persisted in a local JSON file.

## 2. Technology Stack
*   **Runtime:** Node.js (LTS)
*   **Language:** TypeScript
*   **Framework:** Express.js
*   **Data Storage:** Local JSON file (`todos.json`)
*   **Development Tools:** nodemon, ts-node
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript

## 3. Data Model
The application manages a single entity: `Todo`.

```typescript
interface Todo {
    id: string;         // UUID v4
    title: string;      // Max 30 characters
    completed: boolean; // Task status
    createdAt?: string; // ISO 8601 Date string
    quote?: string;     // Motivational quote
    quoteAuthor?: string; // Author of the quote
    dueDate?: string;   // ISO 8601 Date string (Deadline)
}
```

## 4. Functional Requirements

### 4.1. Task Management (API)
| Method | Endpoint       | Description | Validation |
|--------|---------------|-------------|------------|
| GET    | `/todos`      | Retrieve all tasks. | - |
| POST   | `/todos`      | Create a new task. | `title` required. `dueDate` optional. Max 30 chars. |
| PUT    | `/todos/:id`  | Update task status, title, or deadline. | Max 30 chars if `title` provided. |
| DELETE | `/todos/:id`  | Delete a specific task. | - |
| DELETE | `/todos`      | Delete ALL tasks. | - |

### 4.2. User Interface (Frontend)
The frontend is a Single Page Application (SPA) served statically.

*   **List View:** Displays all tasks with their creation date and deadline.
    *   Completed tasks are visually struck through.
    *   Deadline coloring:
        *   Blue: < 24 hours remaining.
        *   Orange: < 1 hour remaining.
        *   Red: Expired (Overdue).
*   **Add Task:** Input field for title and DateTime picker for deadline.
    *   Input prevents typing more than 30 characters (`maxlength="30"`).
    *   Pressing "Enter" key also submits.
*   **Toggle Status:** Clicking a task item or checkbox toggles its completion state.
*   **Delete Task:** A "Delete" button next to each item. Requires confirmation dialog.
*   **Clear All:** A "Clear All" button to remove all tasks. Requires strict confirmation dialog.
*   **Font Size Selector:** A dropdown menu to select font size (Small/Medium/Large). Preference is saved in browser storage.
*   **Sort Order Selector:** A dropdown menu to sort tasks by Deadline (Earliest/Latest) or Created Date (Oldest/Newest). Default is Deadline (Earliest).
*   **Real-time Updates:** The UI updates immediately after operations by re-fetching data from the server (with cache-busting).

## 5. Non-Functional Requirements
*   **Persistence:** Data must survive server restarts.
*   **Stability:** The server must NOT restart automatically when the data file (`todos.json`) is updated.
*   **Validation:** Both client-side (UX) and server-side (Security) validation for the 30-character limit.
*   **Caching:** Client fetch requests must bypass browser cache using timestamp parameters.

## 6. File Structure
```
project-root/
├── src/
│   ├── index.ts    # Express server & API routes
│   └── store.ts    # Data access layer (File I/O)
├── public/
│   ├── index.html  # Main UI
│   ├── style.css   # Styles
│   └── app.js      # Frontend logic
├── todos.json      # Data storage (ignored by nodemon)
├── nodemon.json    # Dev server config
├── package.json
└── tsconfig.json
```
