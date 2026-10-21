---
title: "Kbari Auto"
tagline: "Cross-border automotive replacement parts e-commerce platform connecting Dubai suppliers with the Algerian market"
category: "commercial"
stack:
  - "PHP / Laravel"
  - "TypeScript"
  - "PostgreSQL"
  - "Docker"
  - "REST APIs"
  - "E-Commerce"
highlights:
  - "Engineered customer-facing e-commerce storefront for vehicle owners and repair shops to search, filter, and order automotive parts"
  - "Built full backoffice administration suite to manage multi-vendor orders, customer accounts, and real-time delivery status tracking"
  - "Architected parts compatibility search engine mapping complex OEM and aftermarket parts for Dubai's import market"
  - "Integrated localized shipping and delivery workflows with multi-currency checkout and automated status webhooks"
featured: false
order: 6
publishedDate: "2024-04-15"
logo: "/images/logos/kabri-auto-logo.png"
---

# Kbari Auto: Cross-Border Automotive Parts E-Commerce Platform

**Kbari Auto** is a specialized cross-border e-commerce platform built to streamline the sourcing, purchasing, and delivery of automotive replacement parts between Dubai's parts export market and Algerian vehicle owners, garages, and commercial repair centers.

---

## 1. Project Overview & Core Mission

Sourcing verified OEM and aftermarket automotive replacement parts in Algeria presents significant logistics friction, inconsistent parts compatibility data, and delivery status opacity. **Kbari Auto** bridged this gap by creating a unified dual-sided platform:
- **Customer Storefront**: An intuitive parts discovery catalog where motorists and professional mechanics can quickly locate compatible car parts by vehicle make, model, year, and engine VIN specification.
- **Backoffice Operations Hub**: An end-to-end administration and fulfillment system that orchestrates order processing, customs clearing, regional warehouse handoffs, and live delivery tracking.

---

## 2. Customer-Facing Storefront Features

- **VIN & Vehicle Fitment Filter**: Instant catalog narrowing based on standardized vehicle year-make-model hierarchies to eliminate incorrect orders.
- **Real-Time Parts Availability**: Direct stock indicators linking Dubai supplier inventories with regional depot buffer stocks.
- **Transparent Order Checkout**: Multi-currency conversion (AED, EUR, DZD), integrated cash-on-delivery (COD) workflows, and automated SMS order confirmations.

---

## 3. Backoffice Order & Logistics Management

- **Centralized Order Queue**: Dispatchers and operations managers review incoming orders, approve fulfillment batches, and coordinate with international freight carriers.
- **Granular Delivery Statuses**: End-to-end delivery tracking through multiple operational milestones: *Order Placed*, *Procured in Dubai*, *In Transit (Air/Sea Freight)*, *Customs Cleared*, *Regional Warehouse Arrival*, *Out for Final Delivery*, and *Delivered*.
- **Customer Relationship & Support Portal**: Dedicated client history panel allowing customer service reps to track inquiries, process returns, and update delivery windows.

---

## 4. Technical Architecture & Stack

- **Backend**: PHP / Laravel with modular service architecture and queue workers for background webhook processing.
- **Frontend**: Responsive TypeScript interface with Tailwind CSS components designed for desktop workstations and mobile browsing.
- **Database**: PostgreSQL with indexed vehicle compatibility schemas and relational tracking logs.
- **Infrastructure**: Containerized Docker microservices with Nginx reverse proxy and Redis caching for high-speed catalog lookups.
