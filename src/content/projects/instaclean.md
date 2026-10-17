---
title: "InstaClean"
tagline: "On-demand mobile vehicle care service dispatching with real-time GPS tracking and scheduling"
category: "commercial"
repoUrl: "https://github.com/faycalrafa/for-instaclean"
stack:
  - "Flutter"
  - "Dart"
  - "Android Kotlin"
  - "iOS Swift"
  - "Firebase"
  - "Google Maps API"
  - "Geolocation"
highlights:
  - "Developed on-demand mobile dispatching app connecting vehicle owners directly with mobile detailing agents"
  - "Integrated live GPS location tracking and geofenced automated job status dispatch notifications"
  - "Engineered fluid 60fps Flutter UI with reactive scheduling calendar and multi-step service configuration"
  - "Implemented offline-first mobile architecture with local SQLite state caching and optimistic background syncing"
featured: false
order: 6
publishedDate: "2024-03-10"
---

# InstaClean: On-Demand Mobile Service Platform

**InstaClean** is an on-demand mobile application platform connecting car owners directly with traveling vehicle detailing and cleaning specialists. Serving as **Mobile Developer** at InstaClean (01/2024 - 07/2024), Faycal Rafa designed and implemented the complete mobile client application, bridging reactive Flutter UI with native Android and iOS background location services.

---

## 1. Product Challenge & Real-Time Logistics

Mobile detailing services require reliable two-way coordination between vehicle owners and mobile field technicians:
- **Vehicle Owners**: Need transparent pricing, instant appointment booking at their home or workplace, and real-time visibility into the technician's arrival time.
- **Mobile Technicians**: Need battery-efficient GPS turn-by-turn navigation, geofenced job status check-ins, and offline capability when servicing underground parking garages.

---

## 2. Mobile Architecture & Technical Innovations

### 2.1 Native Platform Bridging (Kotlin & Swift)
- Rather than relying solely on generic plugins, Faycal engineered native Kotlin (Android) and Swift (iOS) platform channels to interface directly with OS-level location providers (`FusedLocationProviderClient` on Android and `CoreLocation` on iOS).
- Optimized background location polling intervals based on device motion activity (stationary vs. driving), slashing battery consumption by over 40% during a technician's workday.

### 2.2 Fluid 60fps Reactive UI
- Implemented state management using clean architecture principles, isolating business logic from UI rendering.
- Engineered smooth 60fps micro-interactions, custom interactive maps with Google Maps API clustering, and responsive scheduling selectors.

### 2.3 Resilient Offline-First Data Synchronization
- Built local caching layers using SQLite and reactive streams, allowing technicians to review service orders, capture before/after photos, and complete checklists even in network-dead zones.
- Changes queue locally and synchronize automatically once network connectivity is re-established.

---

## 3. Technology Stack & Repository Reference

- **Mobile Framework**: Flutter & Dart (Cross-platform Android & iOS)
- **Native Platform Channels**: Kotlin (Android) & Swift (iOS)
- **Cloud Backend & Services**: Firebase Cloud Messaging, Firestore, Google Maps API
- **Repository Reference**: [github.com/faycalrafa/for-instaclean](https://github.com/faycalrafa/for-instaclean)
