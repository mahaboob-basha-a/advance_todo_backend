# Todo List API

This is a Todo List backend API built with Express.js, SQLite, and JWT for authentication. It allows users to register, log in, and manage their todo items.

## Features

- User Registration
- User Login
- JWT Authentication
- CRUD Operations for Todo Items

## Getting Started

### Prerequisites

- Node.js installed
- SQLite installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mahaboob-basha-a/advance_todo_backend.git
2. Navigate to the project directory:
   ```bash
    cd todo-list-api
3. Install the dependencies:
   ```bash
    npm install
4. Create a .env file in the root directory and add your environment variables:
   ```bash
    env
    PORT=3000
    JWT_SECRET=your_jwt_secret
5. Create the SQLite database:
   ```bash
    sqlite3 clawtodo.db
6. sql
   
   ```bash
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
    
    CREATE TABLE todoitems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      description TEXT,
      status BOOLEAN,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
   
7. Running the Server

Start the server:

    ```bash
      npm start
      The server will run on http://localhost:3000.

8. Authentication
All endpoints require an API key. Include your API key in the Authorization header:
  1. Register
      Endpoint: /register
     ```bash
      Method: POST
      
      Description: Register a new user.
      
      Request Body:
      
      JSON
      
      {
        "username": "your_username",
        "password": "your_password"
      }
    Response:
    
    201 Created: Registration successful
    400 Bad Request: Username already exists or password is too short
  2.Login
      Endpoint: /login
    ```bash
      Method: POST
      
      Description: Log in a user.
      
      Request Body:
      
      jSON
      {
        "username": "your_username",
        "password": "your_password"
      }
      Response:
      
      200 OK: Returns a JWT token
      400 Bad Request: Invalid credentials
  3. Get All Todos
     Endpoint: /todos
     ```bash
       Method: GET
        
        Description: Retrieve all todos for the authenticated user.
        
        Headers:
        
        token:YOUR_API_KEY
        Response:
        
        JSON
        
        [
          {
            "id": 1,
            "user_id": 1,
            "description": "Todo description",
            "status": false
          },
          ...
        ]
   4. Create a New Todo
      Endpoint: /todos
      ```bash
    Method: POST
    
    Description: Create a new todo item.
    
    Headers:
    
    Authorization: Bearer YOUR_API_KEY
    Request Body:
    
    JSON
    
    {
      "description": "New todo description",
      "status": false
    }
    Response:
    
    200 OK: Todo item created successfully
    400 Bad Request: Error creating todo item
  5. Update a Todo
     Endpoint: /todos/:id
     
     ```bash
    Method: PUT
    
    Description: Update an existing todo item.
    
    Headers:
    
    token:YOUR_API_KEY
    Request Body:
    
    JSON
    
    {
      "description": "Updated todo description",
      "status": true
    }
    Response:
    
    200 OK: Todo item updated successfully
    400 Bad Request: Error updating todo item
  6. Delete a Todo
     Endpoint: /todos/:id
     
     ```bash
    Method: DELETE
    
    Description: Delete a todo item.
    
    Headers:
    token: YOUR_API_KEY
    Response:
    
    200 OK: Todo item deleted successfully
    400 Bad Request: Error deleting todo item
