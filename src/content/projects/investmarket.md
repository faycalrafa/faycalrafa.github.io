---
title: "InvestMarket"
tagline: "Outil de gestion de portefeuille et d'analyse de performance pour les investisseurs institutionnels et particuliers"
category: "commercial"
liveUrl: "https://investmarket-dz.com/"
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
  - "Plateforme institutionnelle de gestion de portefeuille et d'analyse de performance agréée par la COSOB en Algérie"
  - "Passerelles WebSockets haute fréquence pour la diffusion en direct du carnet d'ordres et des flux de cotation"
  - "Pattern Transactional Outbox garantissant la cohérence stricte des transactions et l'intégrité comptable"
  - "Couche de cache Redis en mémoire réduisant la charge de lecture en base de plus de 65 % en pic de marché"
featured: true
order: 4
publishedDate: "2025-04-01"
---

# InvestMarket: Plateforme Boursière & Gestion de Portefeuille

**InvestMarket** est un Intermédiaire en Opérations de Bourse (IOB) agréé par la **COSOB** en Algérie, offrant des services avancés en matière de gestion de portefeuille, d'analyse de performance et d'accompagnement sur les marchés financiers.

Développée en collaboration avec l'équipe de Finnetude où **Faycal Rafa** exerçait en tant que **Technical Lead** (08/2024 – 04/2025), la plateforme répond aux exigences strictes des institutions financières et des investisseurs particuliers algériens.

---

## 1. Contexte Métier & Enjeux Techniques

- **Agréé COSOB**: Conformité rigoureuse aux normes de régulation financière, traçabilité immuable des ordres et zéro tolérance pour les écarts de réconciliation.
- **Volatilité et Concurrence**: Lors de l'ouverture des séances de cotation, le volume d'appels et les flux de ticks nécessitent une infrastructure élastique capable d'absorber des pics soudains sans dégradation de latence.

---

## 2. Innovations & Architecture Distribuée

### 2.1 Passerelle WebSockets Temps Réel
- Passerelles WebSockets dédiées sous NestJS avec clustering de sockets, permettant à des milliers d'utilisateurs simultanés de recevoir les variations de cours tick-par-tick avec une latence interne inférieure à 5 ms.
- Filtrage des souscriptions par carnet de valeurs pour économiser la bande passante sur les terminaux mobiles.

### 2.2 Intégrité Transactionnelle & Pattern Outbox
- Implémentation du pattern **Transactional Outbox** au-dessus de PostgreSQL pour garantir une livraison *at-least-once* des événements d'ordre vers les services de comptabilité et de reporting financier, même en cas de rupture réseau temporaire.

### 2.3 Mise en Cache en Mémoire Redis
- Cache chaud des meilleures limites du carnet d'ordres et des instantanés de valorisation de portefeuille, diminuant les requêtes en base de plus de 65 % en pleine séance.

---

## 3. Références & Liens

- **Site Officiel InvestMarket**: [investmarket-dz.com](https://investmarket-dz.com/)
- **Dépôt Backend GitHub**: [github.com/faycalrafa/InvestMarket-Backend](https://github.com/faycalrafa/InvestMarket-Backend)
