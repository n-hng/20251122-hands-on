# Architecture Design

## 1. System Context
The system consists of a generic web browser client interacting with a monolithic Node.js server. The server handles both static file serving and API requests. Data is stored in a flat JSON file on the local filesystem.

```mermaid
graph LR
    Client[Web Browser] -- HTTP/JSON --> Server[Express Server]
    Server -- Read/Write --> File[(todos.json)]
    
    subgraph "Node.js Application"
        Server
        Store[TodoStore Class]
        Server --> Store
        Store --> File
    end
```

## 2. Component Design

### 2.1. Client (Frontend)
*   **Responsibility:** Render UI, capture user input, validate length locally, call REST API.
*   **Key Logic:**
    *   `fetchTodos()`: GET with timestamp to avoid cache.
    *   `renderTodos()`: Clear and rebuild DOM list.
    *   `applyFontSize()`: Update CSS variables based on user selection.
    *   `sortTodos()`: Client-side sorting based on user criteria (Deadline/Created).
    *   Event Listeners: Handle Add, Toggle, Delete, Clear All, Font Change, Sort Change actions.

### 2.2. Server (Backend)
*   **Responsibility:** Serve static assets, validate API requests, manage data persistence.
*   **Key Components:**
    *   `src/index.ts`: Route definitions, request validation (30 char limit).
    *   `src/store.ts`: Abstracted file I/O operations (`readData`, `writeData`, `add`, `update`, `delete`, `deleteAll`).
    *   `src/quoteService.ts`: Dictionary-based quote matching logic.

## 3. Key User Flows

### 3.1. Add Todo Flow
User enters text and clicks "Add".

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant S as Server
    participant Q as QuoteService
    participant DB as todos.json

    U->>B: Input Title + DueDate + Click Add
    B->>B: Check Length <= 30 (HTML5)
    B->>S: POST /todos {title, dueDate}
    S->>S: Validate Length <= 30
    S->>Q: getQuote(title)
    Q-->>S: {text, author}
    S->>DB: Read File
    S->>DB: Write File (Append with Quote & DueDate)
    S-->>B: 201 Created
    B->>B: Clear Input
    B->>S: GET /todos?t=timestamp
    S->>DB: Read File
    S-->>B: 200 OK (List)
    B->>B: Calculate Deadline Color
    B->>U: Update UI (Show Todo + Quote + Deadline)
```

### 3.2. Delete All Flow
User clicks "Clear All".

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant S as Server
    participant DB as todos.json

    U->>B: Click "Clear All"
    B->>U: Show Confirm Dialog
    U->>B: Click OK
    B->>S: DELETE /todos
    S->>DB: Write File (Empty [])
    S-->>B: 204 No Content
    B->>S: GET /todos?t=timestamp
    S->>DB: Read File
    S-->>B: 200 OK ([])
    B->>U: Update UI (Empty List)
```
