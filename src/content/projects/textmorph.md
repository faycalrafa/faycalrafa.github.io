---
title: "TextMorph"
tagline: "System-wide, privacy-first autonomous device agent & floating AI companion for Android powered by local Gemma 4 & 3 inference"
category: "open-source"
repoUrl: "https://github.com/faycalrafa/TextMorph"
apkDownloadUrl: "https://github.com/faycalrafa/TextMorph/releases"
liveUrl: "https://faycalrafa.github.io/projects/textmorph"
stack:
  - "Kotlin"
  - "Jetpack Compose"
  - "Autonomous Agent"
  - "Google LiteRT-LM"
  - "Gemma 4 Vision"
  - "Sherpa-ONNX"
  - "AccessibilityService"
  - "Ktor Localhost"
  - "Scoped Storage"
highlights:
  - "System-Wide Floating AI Companion: Living overlay button anchored across any Android application without keyboard focus interruption"
  - "Autonomous Device Agent: Code-as-Action multi-step OS navigation, magnetic target snapping, and self-healing task execution on local Gemma models"
  - "Offline Wake-Word Studio: On-device Sherpa-ONNX voice detection for 'Computer' and 'Hey Tamim' with 3-attempt acoustic calibration"
  - "Hardware-Accelerated Model Hub: Zero-copy Linux mmap loading from Downloads/ for Gemma 4 (Vision) and Gemma 3 on mobile GPU"
  - "Embedded Localhost OpenAI Server: Ktor CIO server on 127.0.0.1:8080 exposing streaming chat completions for Termux and edge scripts"
featured: true
order: 3
publishedDate: "2026-10-20"
logo: "/images/logos/icons/textmorph.png"
screenshots:
  - url: "/images/textmorph/playstore-01-floating-agent.jpg"
    caption: "01 System-Wide Floating AI Agent — Operates everywhere across any Android app"
  - url: "/images/textmorph/playstore-02-autonomous-agent.jpg"
    caption: "02 Autonomous Device Agent — Multi-step task automation on local Gemma 3 & 4"
  - url: "/images/textmorph/playstore-03-conversation-workspace.jpg"
    caption: "03 AI Conversation Workspace — Fast on-device multimodal reasoning and dual chat/agent modes"
  - url: "/images/textmorph/playstore-04-navigation-telemetry.jpg"
    caption: "04 Hardware Telemetry & Command Center — Live CPU, RAM, thermals & offline voice studio"
  - url: "/images/textmorph/playstore-05-model-hub.jpg"
    caption: "05 Hardware-Accelerated Model Hub — Zero-copy Gemma 4 Vision on mobile GPU"
---

# TextMorph: System-Wide On-Device Multimodal AI & Autonomous Agent

**TextMorph** is an open-source, privacy-first autonomous device agent and floating multimodal AI companion engineered by Faycal Rafa for Android. Designed to operate 100% on-device with zero cloud telemetry, subscription barriers, or network dependencies, TextMorph transforms open foundation models (such as **Google Gemma 4 Vision** and **Gemma 3 1B**) into proactive personal agents capable of navigating mobile operating systems, automating complex multi-step device tasks, transforming text in-place, and serving local API requests.

---

## 1. Vision & Core Capabilities

Traditional mobile AI assistants lock users into cloud APIs that harvest private screen content and keystrokes. TextMorph solves this through uncompromising local edge execution:

- **System-Wide Floating Companion**: A living, non-intrusive floating button that hovers over any Android application (WhatsApp, YouTube, Gmail, Chrome, Settings). It maintains contextual awareness, visual status cues (thinking, acting, completed), and quick agent triggers.
- **Autonomous Multi-Step Device Agent**: Users can issue natural language goals (e.g., *"open youtube and search for orange cats"*, *"open settings and check battery"*). TextMorph's on-device agent decomposes the goal, inspects the active accessibility hierarchy, snaps to interactive targets, and executes UI actions autonomously.
- **100% Offline Privacy & Zero Telemetry**: Model weights, voice acoustic vectors, clipboard buffers, and screen captures never leave the smartphone's volatile memory.
- **Zero-Copy Memory-Mapped Storage**: Large `.litertlm` foundation models in `/sdcard/Download/` are memory-mapped via Linux `mmap` and `ParcelFileDescriptor`, avoiding duplicate file storage.

---

## 2. Deep Technical Architecture

### 2.1 Autonomous Agent Engine & Code-as-Action
At the heart of TextMorph v4.2.1 is an autonomous agent runtime executing a **Code-as-Action** paradigm:
- **TaskExecutor & Goal Decomposition**: Decomposes high-level natural language instructions into ordered sub-actions with pre- and post-condition verification.
- **Magnetic Target Snapping**: Solves accessibility tree ambiguity with deepest-leaf text matching, bounding-box proximity heuristics, and `click_element(id)` resolution.
- **Visual Reticle & Click Trace**: Renders an interactive visual indicator dot confirming UI touch points in real time.
- **Skill Memory & Self-Healing**: Powered by `SkillMemoryService`, the agent caches successful action pathways and recovers from unexpected modal dialogs or network glitches.

### 2.2 System-Wide Floating Companion (`AccessibilityService` + `WindowManager`)
- **Non-Focus Stealing Overlay**: Utilizes `WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY` with `FLAG_NOT_FOCUSABLE` and `FLAG_NOT_TOUCH_MODAL`, ensuring software keyboards never dismiss during agent execution.
- **Living Animated Emojis**: The floating bubble dynamically reflects agent states with expressive micro-animations and glowing ambient halos.
- **Quick Agent Request**: Long-pressing or tapping the floating companion instantly summons the agent prompt modal directly over the current app.

### 2.3 Offline Wake-Word Studio & Voice Automations
- **Sherpa-ONNX Acoustic Detection**: Runs lightweight, quantized keyword spotting (KWS) models entirely on-device, supporting custom wake-words such as *"Computer"* and *"Hey Tamim"*.
- **3-Attempt Acoustic Calibration**: Built-in Wake-Word Studio records and calibrates local voice samples to tune sensitivity thresholds and eliminate false triggers.
- **Voice Hotkeys & Triggers**: Configure hardware volume keys or custom voice phrases to trigger bespoke AI automation scripts.

### 2.4 Hardware-Accelerated Model Hub & Zero-Copy Loader
- **LiteRT-LM GPU Runtime**: Direct OpenCL and Vulkan acceleration with automatic fallback to multi-threaded CPU XNNPACK.
- **Gemma 4 Vision & Gemma 3**: Native support for multimodal vision tokens, enabling the agent to visually analyze charts, screenshots, and camera streams.
- **Zero-Copy mmap**: Employs Android Storage Access Framework (SAF) and native Linux `mmap` to stream multi-gigabyte models directly from storage into RAM without copying.

### 2.5 Dual Chat & Agent Workspace with Interactive Tools
- **Segmented Mode Switching**: Seamlessly toggle between conversational reasoning `[Chat]` and autonomous execution `[Agent]` modes.
- **Interactive Chat Tools**: Supports user approval cards for sensitive operations, follow-up suggestion chips, HTML artifact sandbox previewing, and animated GIF trace exports.

### 2.6 Real-Time Telemetry & Embedded Localhost Server
- **Live Profiler**: Continuously monitors LiteRT-LM CPU load, RAM allocation (e.g. 5.7GB footprint), and device thermals (38°C).
- **Embedded Ktor CIO Server**: Exposes standard OpenAI-compatible endpoints (`/v1/models` and `/v1/chat/completions`) on `127.0.0.1:8080` for Termux scripts and local automations.
