---
title: "TextMorph"
tagline: "System-wide, privacy-first multimodal AI writing assistant & floating toolbar for Android powered by on-device LiteRT-LM & Gemma"
category: "open-source"
repoUrl: "https://github.com/faycalrafa/TextMorph"
apkDownloadUrl: "https://github.com/faycalrafa/TextMorph/releases"
liveUrl: "https://faycalrafa.github.io/projects/textmorph"
stack:
  - "Kotlin"
  - "Jetpack Compose"
  - "LiteRT-LM"
  - "Gemma 4"
  - "AccessibilityService"
  - "Ktor Localhost"
  - "Scoped Storage"
highlights:
  - "On-Device Hardware-Accelerated AI: LiteRT-LM GPU inference executing Gemma models locally with zero cloud latency and strict data privacy"
  - "Zero-Copy Downloads Loader: Directly memory-maps large models via ParcelFileDescriptor mmap without duplicate storage overhead"
  - "System-Wide Floating AI Toolbar: AccessibilityService overlay anchored above active input fields without stealing keyboard focus"
  - "Embedded Localhost OpenAI Server: Ktor CIO server on 127.0.0.1:8080 exposing OpenAI-compatible streaming chat completions"
featured: true
order: 3
publishedDate: "2026-10-20"
logo: "/images/logos/icons/textmorph.png"
screenshots:
  - url: "/images/textmorph/screenshot-01-floating-toolbar.jpg"
    caption: "01 System-Wide Floating AI Toolbar — AccessibilityService overlay above active keyboard"
  - url: "/images/textmorph/screenshot-02-model-hub.jpg"
    caption: "02 Hardware-Accelerated Model Hub — Zero-copy Linux mmap loader for Gemma 4"
  - url: "/images/textmorph/screenshot-03-slash-commands.jpg"
    caption: "03 Slash Commands Architecture — Universal /command triggers in any text field"
  - url: "/images/textmorph/screenshot-04-custom-prompts.jpg"
    caption: "04 Custom Prompts & Multimodal Vision — Direct companion actions & Screen Assist"
  - url: "/images/textmorph/screenshot-05-settings-server.jpg"
    caption: "05 Localhost OpenAI Server — Embedded Ktor CIO 127.0.0.1:8080 HTTP server"
---

# TextMorph: System-Wide On-Device Multimodal AI Assistant

**TextMorph** is an open-source, privacy-first multimodal AI assistant engineered by Faycal Rafa for Android. Built from the ground up to operate completely on-device with zero cloud telemetry or subscription barriers, TextMorph marries hardware-accelerated **LiteRT-LM (Gemma 4)** with native Android system integration, delivering intelligent text transformations, visual reasoning, and context-aware smart replies directly inside any text field on your phone.

---

## 1. Vision & Architecture

Modern AI writing tools frequently compromise user confidentiality by shipping private clipboard buffers and on-screen text to remote cloud servers. TextMorph eliminates this risk through high-performance local edge execution:

- **100% On-Device Inference**: Hardware-accelerated GPU inference executes compact multimodal foundation models directly on the smartphone's chipset via Google's LiteRT-LM runtime.
- **Zero Cloud Leakage**: Sensitive keystrokes, personal correspondence, and proprietary documents never leave device memory.
- **Zero-Copy Memory-Mapped Storage**: Large `.litertlm` model weights residing in the user's `Downloads/` directory are memory-mapped via Linux `mmap` and Android `ParcelFileDescriptor` directly into native memory buffers—saving gigabytes of redundant flash storage.

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

### 2.4 Forest Clay Jetpack Compose Material 3 Design
Crafted following modern reactive Android development principles, TextMorph features:
- **Forest Clay UI Palette**: A bespoke natural claymorphic design system balancing dark emerald tones with warm clay accents.
- **Adaptive Dialogs**: Dynamic full-width dialog properties (`DialogProperties(usePlatformDefaultWidth = false)` + `FlowRow`) ensuring comfortable touch targets across diverse screen aspect ratios.
- **Diagnostic Logging & Update Engine**: Real-time reactive in-app developer telemetry (`AppLogger`) and automated GitHub release APK updates.
