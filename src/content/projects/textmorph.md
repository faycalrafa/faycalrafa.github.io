---
title: "TextMorph"
tagline: "System-wide, privacy-first multimodal AI writing assistant & floating toolbar for Android powered by multi-engine local LLM inference"
category: "open-source"
repoUrl: "https://github.com/faycalrafa/TextMorph"
apkDownloadUrl: "https://github.com/faycalrafa/TextMorph/releases"
liveUrl: "https://faycalrafa.github.io/projects/textmorph"
stack:
  - "Kotlin"
  - "Jetpack Compose"
  - "Multi-Engine LLM"
  - "LiteRT-LM"
  - "AccessibilityService"
  - "Ktor Localhost"
  - "Scoped Storage"
highlights:
  - "Multi-Engine On-Device Inference: Hardware-accelerated GPU/NPU inference running any local LLM with zero cloud latency and total privacy"
  - "Universal Zero-Copy Model Loader: Memory-maps large models directly from Downloads via ParcelFileDescriptor mmap without duplicate storage"
  - "System-Wide Floating AI Toolbar: AccessibilityService overlay anchored above active input fields without stealing keyboard focus"
  - "Embedded Localhost OpenAI Server: Ktor CIO server on 127.0.0.1:8080 exposing OpenAI-compatible streaming chat completions"
featured: true
order: 3
publishedDate: "2026-10-20"
logo: "/images/logos/icons/textmorph.png"
screenshots:
  - url: "/images/textmorph/playstore-01-floating-toolbar.jpg"
    caption: "01 System-Wide Floating AI Toolbar — Works inside any chat, email, or text field"
  - url: "/images/textmorph/playstore-02-model-hub.jpg"
    caption: "02 Hardware-Accelerated Model Hub — Instant zero-copy mmap loading for local LLMs across multiple engines"
  - url: "/images/textmorph/playstore-03-slash-commands.jpg"
    caption: "03 Slash Commands Architecture — Type /command anywhere for instant AI transformations"
  - url: "/images/textmorph/playstore-04-custom-prompts.jpg"
    caption: "04 Custom Prompts & Multimodal Vision — Multimodal vision reasoning & one-tap clipboard summaries"
  - url: "/images/textmorph/playstore-05-settings-server.jpg"
    caption: "05 Localhost OpenAI Server — Embedded Ktor HTTP server on 127.0.0.1:8080 for external apps"
---

# TextMorph: System-Wide On-Device Multimodal AI Assistant

**TextMorph** is an open-source, privacy-first multimodal AI assistant engineered by Faycal Rafa for Android. Built from the ground up to operate completely on-device with zero cloud telemetry or subscription barriers, TextMorph features a versatile **multi-engine runtime architecture** capable of executing any open-weight LLM or vision-language model locally with full GPU and NPU hardware acceleration, delivering intelligent text transformations, visual reasoning, and context-aware smart replies directly inside any text field on your phone.

---

## 1. Vision & Architecture

Modern AI writing tools frequently compromise user confidentiality by shipping private clipboard buffers and on-screen text to remote cloud servers. TextMorph eliminates this risk through high-performance local edge execution:

- **Universal Multi-Engine Local Execution**: Rather than locking into a single proprietary model, TextMorph integrates multiple high-efficiency inference engines (including Google LiteRT-LM and native hardware backends). Users can load and run any compatible open foundation model locally with seamless hardware acceleration.
- **100% On-Device Privacy & Zero Telemetry**: Sensitive keystrokes, personal correspondence, and proprietary documents never leave device memory.
- **Zero-Copy Memory-Mapped Storage**: Large model weights residing in the user's `Downloads/` directory are memory-mapped via Linux `mmap` and Android `ParcelFileDescriptor` directly into native memory buffers—saving gigabytes of redundant flash storage.

---

## 2. Core Architectural Subsystems

### 2.1 Mode 1: Zero-Permission System Text Selection (`ACTION_PROCESS_TEXT`)
TextMorph registers as a first-class citizen in Android's native text selection context menu. Users highlight text in any application (browser, chat, email, notes) and immediately invoke customized transformation pipelines—such as grammar correction, professional tone shifting, summarization, or translation—with seamless in-place text replacement.

### 2.2 Mode 2: Non-Intrusive Floating AI Toolbar (`AccessibilityService`)
By pairing an optimized Android `AccessibilityService` with `WindowManager` overlay capabilities:
- **Focus Anchoring**: Automatically detects when editable text fields acquire focus and positions a compact, draggable floating action pill directly above the active keyboard.
- **Non-Focus Stealing**: Configured with `FLAG_NOT_FOCUSABLE` and non-interfering touch bounds, allowing uninterrupted software keyboard typing while offering one-tap prompt execution.

### 2.3 Embedded Localhost OpenAI Server
TextMorph embeds a lightweight, non-blocking **Ktor CIO HTTP server** listening on `127.0.0.1:8080`. This exposes standard OpenAI-compatible endpoints (`/v1/models` and streaming `/v1/chat/completions`), turning the Android device into a local LLM server for automated scripts, local Termux agents, and third-party mobile applications.

### 2.4 Charcoal & Slate Jetpack Compose Material 3 Design
Crafted following modern reactive Android development principles, TextMorph features:
- **Charcoal & Slate UI Palette**: A sleek, dark minimalist design system balancing deep slate tones with crisp high-contrast accents.
- **Adaptive Dialogs**: Dynamic full-width dialog properties (`DialogProperties(usePlatformDefaultWidth = false)` + `FlowRow`) ensuring comfortable touch targets across diverse screen aspect ratios.
- **Diagnostic Logging & Update Engine**: Real-time reactive in-app developer telemetry (`AppLogger`) and automated GitHub release APK updates.
