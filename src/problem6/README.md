# Real-time Scoreboard Service

## 1. Overview

This module is responsible for managing a **high-performance, real-time Top 10 Leaderboard** with strong consistency and abuse protection.

When a user completes a valid action, the system will:

- Increment the user's score
- Update the Top 10 leaderboard
- Broadcast the updated leaderboard to all connected clients in real-time

**Core Goal**: High performance, real-time updates, strong security, and scalability.

## 2. Requirements

### Functional Requirements

- Receive score update requests from authenticated users
- Increase user score for each valid action
- Maintain and serve the current **Top 10** leaderboard
- Push real-time leaderboard updates to all connected clients
- Prevent unauthorized or fraudulent score manipulation

### Non-Functional Requirements

- Real-time updates via WebSocket
- Strong protection against abuse and DDoS
- High availability and horizontal scalability

## 3. High-Level Architecture

<img width="1068" height="718" alt="image" src="https://github.com/user-attachments/assets/3d7b8957-4928-4364-9aa6-7923dcc4e9ca" />

| Main Component    | Technology Stack               | Responsibility                                     |
| ----------------- | ------------------------------ | -------------------------------------------------- |
| API Gateway       | NestJS / Express               | Routing, rate limiting, authentication entry point |
| Auth Service      | JWT + Redis                    | Token verification and session validation          |
| Score Service     | NestJS / Go / Java             | Business logic, score validation and processing    |
| Redis             | Redis cluster (ZSET + Pub/Sub) | Real-time leaderboard storage + event broadcasting |
| Database          | PostgreSQL                     | Source of truth (persistent score storage)         |
| WebSocket Service | Socket.IO / NestJS WS          | Real-time broadcasting to clients                  |

## 4. Data Model

Users Table

```sql
CREATE TABLE users (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
username VARCHAR(50) UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);
```

User Scores Table

```sql

CREATE TABLE user_scores (
user_id UUID PRIMARY KEY REFERENCES users(id),
score BIGINT DEFAULT 0,
updated_at TIMESTAMP DEFAULT NOW()
);
```

Recommended Index:

```sql
CREATE INDEX idx_user_scores_score ON user_scores(score DESC);
```

## 5. API Endpoints

- Public Endpoint
  - GET /api/leaderboard/top10 — Returns current Top 10 (from Redis)

- Protected Endpoint
  - POST /api/score/update - Body: { "actionId": "string","idempotencyKey": "550e8400-e29b-41d4-a716-446655440000", "metadata": {} }
  - Increases score for the authenticated user

## 6. Critical Flow: Score Update

1. Client generates idempotencyKey → calls API
2. API Gateway: Global & per-user rate limiting
3. JWT verification
4. Score Service (core logic):
   - Idempotency check (Redis)
   - Anti-cheat validation
   - Write to PostgreSQL (source of truth)
   - ZADD to Redis Sorted Set
   - Store idempotency record (TTL 24h)
   - Publish event via Redis Pub/Sub

5. WebSocket Service broadcasts update
6. Clients receive leaderboard:updated event

## 7. Key Design Decisions & Trade-offs

- Idempotency: Handled at Score Service using Redis (fast + distributed). Trade-off: Redis memory usage vs safety.
- Real-time: Redis Pub/Sub (simple, low latency). Alternative: Kafka + WebSocket for larger scale (> 100k concurrent users).
- Consistency: Hybrid — Redis for speed, PostgreSQL for truth, Reconciliation cron for eventual consistency.
- Atomicity: Plan to use Redis Lua Script for ZADD + Publish + Idempotency check in one operation.

## 8. Security & Anti-Abuse

- Multi-layer rate limiting
- Mandatory JWT + scope validation
- Idempotency protection
- Server-side action validation (never trust client score)
- Rate limiting per action type
- Audit log + anomaly detection (future)

## 9. Observability & Resilience

- Metrics: Prometheus (request latency, Redis ops, WS connections, error rate)
- Logging: Structured logs + correlation ID
- Tracing: OpenTelemetry
- Alerting: High error rate, Redis memory, slow queries
- Circuit Breaker & Retry strategy in inter-service calls

## 10. Improvements & Future Enhancements

- Migrate Pub/Sub to Kafka for better durability at scale
- Leaderboard sharding per region/game mode
- Advanced anti-cheat (machine learning based)
- Edge caching for Top 10 (CDN + stale-while-revalidate)
- Support Top 50 / Top 100 dynamically

## 11. Implementation Notes

- Score Service must be stateless and horizontally scalable.
- Prioritize Redis Lua scripts for critical paths.
- Reconciliation job must be idempotent and safe to run concurrently.
- Write comprehensive unit + integration tests for idempotency and race conditions.
