---
title: "SABIL Mega-App"
tagline: "High-throughput enterprise financial services and multi-channel digital payment platform"
category: "commercial"
liveUrl: "https://sabil.dz/en/getapp/"
stack:
  - "NestJS"
  - "TypeScript"
  - "PostgreSQL"
  - "Docker"
  - "Redis"
  - "Microservices"
  - "Distributed Transactions"
highlights:
  - "Architected enterprise distributed microservices powering fintech operations for thousands of active daily users"
  - "Engineered resilient payment orchestration workflows supporting multiple digital financial payment gateways"
  - "Database partitioning and index optimization yielding sub-50ms API response times under high concurrency"
  - "Containerized multi-service deployment with Docker, health probes, and automated failover recovery"
featured: true
order: 4
publishedDate: "2025-08-15"
logo: "/images/logos/sabil-logo.png"
screenshots:
  - url: "/images/projects/sabil/1.webp"
    caption: "SABIL Consumer Home — Real-time Account Balances, Fast Actions & Mini-App Grid"
  - url: "/images/projects/sabil/2.webp"
    caption: "Instant QR Payment Engine — Fast Merchant Checkout & Transaction Authorization"
  - url: "/images/projects/sabil/3.webp"
    caption: "Digital Wallet Management — Card Controls, Security Settings & Daily Limits"
  - url: "/images/projects/sabil/4.webp"
    caption: "Multi-Channel Utilities & Bill Payments — Fast Settlements & Digital Receipts"
---

# SABIL Mega-App: Digital Payment & Financial Microservices

**SABIL** is a major Algerian digital payments and financial services mega-app operating at national scale. As a **Senior Software Engineer** at SABIL Company (04/2025 - 02/2026), Faycal Rafa was instrumental in designing, architecting, and optimizing the distributed microservices that power the consumer-facing mobile application and critical administrative back-office operations.

---

## 1. Enterprise Scale & Mission-Critical Responsibilities

The SABIL platform processes millions of transactional records annually across multiple payment categories including merchant QR code payments, utility bill collections, peer-to-peer transfers, and micro-insurance integrations:
- **Zero Downtime Mandate**: Financial systems require continuous availability, stringent audit logging, and zero tolerance for balance reconciliation discrepancies.
- **Microservices Engineering**: Faycal architected modular NestJS services communicating via asynchronous event channels and synchronous REST APIs, ensuring decoupled lifecycles between core ledger, payment gateway integration, and notification modules.

---

## 2. Key Architectural Contributions

### 2.1 Multi-Gateway Payment Orchestration
- Designed a unified payment orchestration engine that abstracts third-party banking switches, regional cards, and mobile network operator payment rails into a coherent internal API contract.
- Built automated retry with exponential backoff and idempotency key verification to guarantee that duplicate network submissions never cause double-charging under unstable cellular connectivity.

### 2.2 Database Partitioning & Extreme Throughput Tuning
- Handled massive transaction history growth by implementing table range partitioning by date within PostgreSQL, keeping primary query indices hot in memory.
- Optimized database execution plans, connection pool sizing with PgBouncer, and index structures, driving average end-to-end API response latency under 50ms even during month-end bill payment spikes.

### 2.3 DevOps & Containerized Resiliency
- Structured containerized deployments using Docker and health check probes, facilitating zero-downtime rolling updates.
- Integrated comprehensive distributed tracing and error telemetry to pinpoint upstream third-party gateway degradations before they impact end-user experience.

---

## 3. Product Availability & Links

- **Application Download**: Available for Android and iOS devices at [sabil.dz/en/getapp](https://sabil.dz/en/getapp/)
- **Target Audience**: Algerian consumers and commercial merchants nationwide
- **Role Duration**: Senior Software Engineer (04/2025 – 02/2026)
