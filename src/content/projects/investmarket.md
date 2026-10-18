---
title: "InvestMarket & ALFA+"
tagline: "Portfolio management, performance analytics & immersive digital multi-asset trading simulator"
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
  - "Engineered ALFA+: 100% digital multi-asset trading simulator and market academy"
  - "Transactional outbox pattern ensuring resilient message delivery and data consistency with PostgreSQL"
  - "Redis pub/sub caching layer reducing database read load by over 65% during peak trading sessions"
featured: true
order: 3
publishedDate: "2025-04-01"
---

# InvestMarket & ALFA+: Real-Time Trading & Market Simulator

**InvestMarket** and **ALFA+** represent dual flagship financial software platforms engineered during Faycal Rafa's tenure as **Technical Lead** at Finnetude (08/2024 - 04/2025).

- **InvestMarket**: Outil de gestion de portefeuille et d'analyse de performance pour les investisseurs institutionnels et particuliers. Handles high-concurrency order placement, live market tick ingestion, and real-time portfolio valuation updates.
- **ALFA+**: Plateforme de formation révolutionnaire, entièrement numérique, dédiée à l'apprentissage du trading et aux activités des marchés. Conçue pour les apprenants professionnels des marchés, les entreprises, les étudiants et les particuliers souhaitant maîtriser l'activité du trading multi-actifs. Notre simulateur 100 % digital permet aux utilisateurs de développer leurs compétences de trading en temps réel dans des conditions de marché authentiques.

---

## 1. Business Context & Engineering Leadership

As Technical Lead, Faycal directed a cross-functional squad of 6 engineers across the complete Software Development Life Cycle (SDLC):
- **Challenge**: The existing architecture suffered from coupling bottlenecks during market open volatility, causing intermittent latency spikes on WebSocket quote streams and order execution queues.
- **Solution**: Faycal orchestrated a complete architectural refactoring from a legacy monolithic core into an event-driven, decoupled microservices topology, dramatically increasing throughput capacity, service isolation, and achieving 99.9% uptime.

---

## 2. Distributed Architecture & Core Innovations

### 2.1 High-Frequency WebSocket Gateway
- Engineered specialized WebSocket gateways in NestJS with socket clustering, enabling thousands of concurrent client connections to receive tick-by-tick bid/ask prices with sub-5ms internal routing delays.
- Implemented client channel subscription filters to ensure traders receive real-time updates only for the securities currently in their active watchlists, preventing bandwidth saturation on mobile clients.

### 2.2 ALFA+ Digital Trading Simulator
- Interactive multi-asset trading simulator mimicking live market liquidity, dynamic order books, and real-time execution slip.
- Provides immersive feedback for corporate trainees and university finance students, allowing live strategy simulation with realistic risk telemetry.

### 2.3 Transactional Integrity & The Outbox Pattern
- In stock trading systems, ledger discrepancies are intolerable. Faycal implemented the **Transactional Outbox Pattern** on top of PostgreSQL:
  - Financial order insertions and domain events are committed within the same database transaction block.
  - An asynchronous polling publisher picks up queued outbox events and pushes them to Redis pub/sub topics, guaranteeing *at-least-once* event delivery to accounting and portfolio ledger services even across transient network partitions.

### 2.4 Redis Caching & In-Memory Market State
- Deployed in-memory Redis data structures to cache the latest top-of-book market prices and user balance snapshots.
- Mitigated hot-key contention during sudden market surges, reducing transactional database reads by over 65% during peak trading windows.

---

## 3. Technology Stack & Source Reference

- **Backend Core**: NestJS, Node.js, TypeScript strict mode
- **Real-Time Layer**: Socket.io / Native WebSockets, Redis Pub/Sub
- **Database & Storage**: PostgreSQL (with ACID isolation levels), Redis Cache
- **Infrastructure**: Docker, Docker Compose, automated CI/CD pipeline
- **Repository Reference**: [github.com/faycalrafa/InvestMarket-Backend](https://github.com/faycalrafa/InvestMarket-Backend)
