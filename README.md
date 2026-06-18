# Technical Assessment: Backend Engineering Solutions

Welcome to my technical assessment repository. This project contains production-ready solutions for both algorithmic problem-solving and software architecture design, written entirely in **TypeScript**.

The codebase is built with a focus on **Clean Code**, **SOLID principles**, **Defensive Programming**, and **High Testability**, matching the rigorous standards of enterprise-level software engineering.

---

## 📂 Project Structure

```text
.
├── src/
│   ├── problem4/                  # Problem 4: Algorithmic Implementations
│   │   └── summation.ts           # 3 unique ways to sum to n
│   │
│   └── problem5/                  # Problem 5: Production-Ready CRUD Server
│       ├── src/
│       │   ├── config/            # SQLite & Environment configurations
│       │   ├── controllers/       # HTTP Request Handlers
│       │   ├── dtos/              # Data Transfer Objects & Validation Schemas (Zod)
│       │   ├── errors/            # AppError & Custom Domain Extensions
│       │   ├── middlewares/       # Global Error Handler, Rate Limiting & Security
│       │   ├── models/            # Domain Entities & Types
│       │   ├── repository/        # Data Access Layer (Repository Pattern)
│       │   ├── services/          # Pure Business Logic Layer
│       │   │   └── __tests__/     # Unit Test Suites (Jest)
│       │   ├── utils/             # Winston Logger & System Helpers
│       │   └── app.ts             # Express Application Bootstrap
│       └── package.json
│
├── .gitignore                     #
├── package.json                   # Root package manager
└── README.md                      # Global Documentation (This file)
