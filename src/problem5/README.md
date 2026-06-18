# Problem 5: A Crude Server (ExpressJS + TypeScript + SQLite)

A clean, production-ready, light-weight CRUD backend service built with ExpressJS, TypeScript, and SQLite for robust data persistence. This project demonstrates high-quality code organization, proper error handling, and strict input validation.

---

## 🚀 Features

- Full CRUD Interfaces: Complete resource management for a `Book` entity.
- Dynamic Filtering: Advanced query capabilities to filter books by `title`, `author`, or `genre`.
- Persistent Storage: Zero-configuration local database using SQLite (embedded, no separate database setup required for the reviewer).
- Strongly-Typed Architecture: Built from the ground up with TypeScript for type-safety.
- Robust Validation: Request payloads are strictly validated using Zod Schema.
- Global Error Handling: Centralized error architecture preventing internal stack traces from leaking to the client.
- Automated Testing: Unit test suite included using Jest.

---

### Core API Specifications

#### 1. Create a New Book

    Endpoint: `POST /api/books`
    Description:  Creates a new book record in the persistent storage.
    Request Validation:  Strict body payload tracking secured via Zod Schema models.
    {
        "title": "Audio Book",
        "author": "admin",
        "publishedYear": 2011,
        "genre": "example"
    }

#### 2. List Books (With Dynamic Filtering)

    Endpoint:  `GET /api/books`
    Description:  Retrieves a collection of books with multi-field searching capabilities.
    Query Parameters Supported:
        Filter by title: `?title=Clean Code`
        Filter by genre: `?genre=Software`
        Filter by author: `?author=Robert`
        Combined criteria query: `?title=test1&page=1&limit=5`

#### 3. Get Book Details

    Endpoint:  `GET /api/books/:id`
    Description:  Fetches complete structural attributes for a specific book matching the provided unique identifier.

#### 4. Update Book Information

    Endpoint:  `PUT /api/books/:id`
    Description:  Modifies existing fields of a designated book.
    Optimization Note:  Supports partial body updates (patches missing validation inputs smoothly), avoiding redundant data payload handling.
    {
        "title": "Audio book2",
        "author": "admin",
        "publishedYear": 2011,
        "genre": "Aotuong"
    }

#### 5. Delete a Book

    Endpoint:  `DELETE /api/books/:id`
    Description:  Purges the targeted book resource permanently from the persistent storage.

---

## 🏁 Getting Started

### 1. Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v18.x or higher recommended)
- npm or yarn

### 2. Installation

Navigate to the project directory and install the necessary dependencies:

```bash
cd problem5
npm install
```

# Run Application:

npm run dev

# Run tests

npm run test

# Run tests with test coverage report

npm run test:coverage
