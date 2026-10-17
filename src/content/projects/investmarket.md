---
title: "InvestMarket"
tagline: "Real-time stock trading and portfolio management platform microservices backend"
category: "commercial"
repoUrl: "https://github.com/faycalrafa/InvestMarket-Backend"
stack:
  - "NestJS"
  - "TypeScript"
  - "WebSockets"
  - "PostgreSQL"
  - "Docker"
  - "Redis"
  - "Microservices"
highlights:
  - "Architected decoupled fintech microservices for real-time market data streaming and portfolio execution"
  - "High-frequency WebSocket gateways broadcasting low-latency order book and price updates"
  - "Transactional outbox pattern ensuring resilient message delivery and data consistency with PostgreSQL"
  - "Redis pub/sub caching layer reducing database read load by over 65% during peak trading sessions"
featured: false
order: 3
publishedDate: "2025-04-01"
---

# InvestMarket: Real-Time Stock Trading & Fintech Microservices

**InvestMarket** is an institutional-grade stock trading and portfolio management backend platform engineered for the fintech sector. Developed during Faycal Rafa's role as **Technical Lead** at Finnetude (08/2024 - 04/2025), the system was architected to handle high-concurrency order placement, live market tick ingestion, and real-time portfolio valuation updates.

---

## 1. Business Context & Engineering Leadership

As Technical Lead, Faycal led a cross-functional engineering team through the complete Software Development Life Cycle (SDLC) to modernize Finnetude's electronic trading infrastructure:
- **Challenge**: The existing architecture suffered from coupling bottlenecks during market open volatility, causing intermittent latency spikes on WebSocket quote streams.
- **Solution**: Faycal orchestrated a complete architectural refactoring from a legacy monolithic core into an event-driven, decoupled microservices topology, dramatically increasing throughput capacity, service isolation, and automated failover recovery.

---

## 2. Distributed Architecture & Core Innovations

### 2.1 High-Frequency WebSocket Gateway
- Engineered specialized WebSocket gateways in NestJS with socket clustering, enabling thousands of concurrent client connections to receive tick-by-tick bid/ask prices with sub-5ms internal routing delays.
- Implemented client channel subscription filters to ensure traders receive real-time updates only for the securities currently in their active watchlists, preventing bandwidth saturation on mobile clients.

### 2.2 Transactional Integrity & The Outbox Pattern
- In stock trading systems, ledger discrepancies are intolerable. Faycal implemented the **Transactional Outbox Pattern** on top of PostgreSQL:
  - Financial order insertions and domain events are committed within the same database transaction block.
  - An asynchronous polling publisher picks up queued outbox events and pushes them to Redis pub/sub topics, guaranteeing *at-least-once* event delivery to accounting and portfolio ledger services even across transient network partitions.

### 2.3 Redis Caching & In-Memory Market State
- Deployed in-memory Redis data structures to cache the latest top-of-book market prices and user balance snapshots.
- Mitigated hot-key contention during sudden market surges, reducing transactional database reads by over 65% during peak trading windows.

---

## 3. Technology Stack & Source Reference

- **Backend Core**: NestJS, Node.js, TypeScript strict mode
- **Real-Time Layer**: Socket.io / Native WebSockets, Redis Pub/Sub
- **Database & Storage**: PostgreSQL (with ACID isolation levels), Redis Cache
- **Infrastructure**: Docker, Docker Compose, automated CI/CD pipeline
- **Repository Reference**: [github.com/faycalrafa/InvestMarket-Backend](https://github.com/faycalrafa/InvestMarket-Backend)
