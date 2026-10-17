# Faycal Rafa — Developer Portfolio & Projects

[![Live Site](https://img.shields.io/badge/Live%20Portfolio-faycalrafa.github.io-blue?style=flat&logo=googlechrome&logoColor=white)](https://faycalrafa.github.io)
[![Astro 5](https://img.shields.io/badge/Astro-5.4-BC52EE?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

Personal developer portfolio and software engineering showcase for **Faycal Rafa** — Senior Software Engineer & Technical Lead.

---

## 🌐 Live Portfolio Website

The portfolio is deployed to GitHub Pages and available at:

👉 **[https://faycalrafa.github.io](https://faycalrafa.github.io)**

---

## 🛠️ Hobby Projects

> **Status:** For now, **1 hobby project is available**, with additional hobby projects currently in active development and slated for release soon.

### 1. BookReader — Native Android Novel Reader & Audio Streaming Engine

A high-performance Android novel reader engineered from scratch in Kotlin, featuring an ergonomic Jetpack Compose Material 3 interface and an industrial-grade background audio narration engine.

* **Live Showcase & Interactive Web Demo:**  
  [https://faycalrafa.github.io/projects/bookreader](https://faycalrafa.github.io/projects/bookreader)
* **GitHub Repository:**  
  [https://github.com/faycalrafa/free-novel-reader-tts-android](https://github.com/faycalrafa/free-novel-reader-tts-android)
* **Direct APK Download:**  
  [Download v3.4.0 APK](https://github.com/faycalrafa/free-novel-reader-tts-android/releases/download/v3.4.0/app-release.apk)

#### Key Highlights & Architecture:
* **Native TextToSpeech Engine:** Quote-aware sentence chunking and CJK punctuation splitting for conversational audio cadence.
* **AndroidX Media3 Service:** Background `MediaSessionService` with persistent lock-screen and notification controls.
* **Modern UI:** Jetpack Compose Material 3 with dynamic theming and fluid custom font typography.
* **Atomic State Persistence:** Scoped Storage `AtomicFiles` preventing bookmark corruption during abrupt OS kills.
* **Web Scraper Pipeline:** Jsoup DOM extraction with userscript support for web novels.

---

### ⏳ Upcoming Hobby Projects
* *More hobby projects are under active development and will be added here as they launch!*

---

## 💼 Other Featured Projects

In addition to hobby projects, the portfolio showcases commercial enterprise systems and open-source contributions:

* **[PIASSA B2B Automotive Platform](https://piassa.shop/)** — Automotive spare parts B2B marketplace, VIN compatibility search engine, and supplier CRM.
* **[SABIL Mega-App](https://sabil.dz/en/getapp/)** — High-throughput enterprise financial services and digital payment platform.
* **[InvestMarket Backend](https://github.com/faycalrafa/InvestMarket-Backend)** — Real-time fintech stock trading and portfolio management microservices.
* **[InstaClean](https://github.com/faycalrafa/for-instaclean)** — On-demand vehicle care dispatching mobile app with live GPS tracking.
* **[StartingPack](https://github.com/faycalrafa/StartingPack)** — Production starter boilerplate for Svelte 5 Runes and TypeScript.

---

## 💻 Tech Stack (Portfolio)

* **Framework:** [Astro 5](https://astro.build/) (Static Site Generation / Content Collections)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Language:** TypeScript
* **Deployment:** GitHub Pages via GitHub Actions CI/CD

---

## 🚀 Local Development

To run this portfolio locally:

### 1. Prerequisites
* **Node.js** `>= 24.0.0`
* **npm** `>= 10.0.0`

### 2. Installation
```bash
git clone https://github.com/faycalrafa/faycalrafa.github.io.git
cd faycalrafa.github.io
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### 4. Build & Typecheck
```bash
# Run Astro diagnostics and type checking
npm run check

# Build static output for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Contact

* **Author:** Faycal Rafa
* **Email:** [rafafaycal@gmail.com](mailto:rafafaycal@gmail.com)
* **Website:** [https://faycalrafa.github.io](https://faycalrafa.github.io)
