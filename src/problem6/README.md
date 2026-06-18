Real-time Scoreboard Service

1.  Overview

    This module is a backend API service responsible for maintaining a real-time Top 10 leaderboard.

        Core responsibilities:
            - Receive score update requests from authenticated users
            - Validate and authorize score increments
            - Persist updated scores
            - Broadcast real-time leaderboard updates to clients
            - Ensure protection against abuse (fraudulent score inflation)

2.  System Requirements

    Functional Requirements

        - User performs an action → backend receives score update request
        - Each valid action increases user score
        - Maintain a Top 10 leaderboard
        - Real-time updates pushed to all connected clients
        - Prevent unauthorized score manipulation

3.  High-Level Architecture
    Components: - API Gateway / Backend Server (Node.js / Express / NestJS) - Auth Service (JWT-based) - Score Service - Database (PostgreSQL / MySQL) - Cache Layer (Redis Sorted Set) - Message Broker (Kafka / RabbitMQ optional but recommended) - WebSocket Server (Socket.IO / WS)
4.  Data Model
    User Table
    users (
    id UUID PRIMARY KEY,
    username TEXT,
    created_at TIMESTAMP
    )
    Score Table
    user_scores (
    user_id UUID PRIMARY KEY,
    score INT DEFAULT 0,
    updated_at TIMESTAMP
    )
