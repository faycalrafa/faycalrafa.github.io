---
title: "BookReader"
tagline: "High-performance native Android novel reader with real-time text-to-speech audio streaming"
category: "hobby"
repoUrl: "https://github.com/faycalrafa/free-novel-reader-tts-android"
apkDownloadUrl: "https://github.com/faycalrafa/free-novel-reader-tts-android/releases/download/v3.4.0/app-release.apk"
liveUrl: "https://faycalrafa.github.io/projects/bookreader"
stack:
  - "Android Kotlin"
  - "Jetpack Compose M3"
  - "AndroidX Media3"
  - "ExoPlayer"
  - "Jsoup"
  - "AtomicFiles"
  - "TextToSpeech"
highlights:
  - "Native TextToSpeech engine with quote-aware sentence chunking and CJK punctuation splitting"
  - "AndroidX Media3 background MediaSessionService with persistent lock screen & notification controls"
  - "Jetpack Compose Material 3 UI with dynamic theming, smooth scrolling, and custom font rendering"
  - "Corruption-resistant reading state persistence using Scoped Storage AtomicFiles"
  - "Jsoup DOM parsing pipeline with userscript extensibility for clean web-to-book chapter extraction"
featured: true
order: 1
publishedDate: "2026-03-15"
---

# BookReader: Android Novel Reader & Audio Streaming Engine

**BookReader** is Faycal Rafa's ongoing flagship personal hobby project, engineered to solve the practical challenges of long-form digital novel reading on Android. Built entirely from scratch in Kotlin, BookReader marries an ergonomic Jetpack Compose Material 3 reading interface with an industrial-grade background audio narration engine powered by AndroidX Media3 and native TextToSpeech (TTS).

---

## 1. Flagship Vision & Personal Motivation

As an avid reader of web serials and translated light novels, Faycal noticed that existing mobile reading apps suffered from two major limitations:
1. **Mechanical, robotic TTS playback**: Default TTS implementations blindly slice text at arbitrary lengths or pause awkwardly in the middle of dialogue quotations, destroying conversational cadence.
2. **Brittle state persistence**: Sudden background task kills by aggressive Android OEM battery managers routinely corrupted reading position bookmarks and user chapter caches.

BookReader was born as a labor-of-love engineering laboratory to demonstrate how modern Android architecture (Jetpack Compose, Media3 `MediaSessionService`, Scoped Storage `AtomicFiles`, and heuristic linguistic parsing) can eliminate these friction points entirely.

---

## 2. Core Architectural Pillars

### 2.1 Decoupled Media3 Audio Architecture
The audio playback subsystem is completely isolated from the UI layer:
- **`MediaSessionService`**: Operates in an independent background Android Service lifecycle, surviving UI orientation changes and app minimization.
- **Lock Screen & Notification Controls**: Full integration with Android 13+ media player notifications, enabling seek, play/pause, skip sentence, and sleep timer adjustments without unlocking the device.
- **Audio Focus Management**: Automatically handles phone calls, navigation prompts, and transient ducking according to modern Android media guidelines.

### 2.2 Quote-Aware & Multilingual Sentence Chunking
To deliver natural audio pacing, BookReader utilizes an algorithmic regex tokenizer that:
- **Protects Dialogue Quotes**: Identifies open and close quotation marks (`"..."`, `«...»`, `“...”`, `「...」`), ensuring that entire character utterances are spoken with consistent cadence rather than split at internal commas or ellipsis.
- **Protects Abbreviations & Numbers**: Heuristically shields common honorifics (`Mr.`, `Dr.`), chapter indices (`Ch. 12`), and floating-point numbers (`v3.4.0`) from being falsely interpreted as terminal full stops.
- **Multilingual Support**: Fully handles Western punctuation (`. ! ?`), Arabic punctuation (`؟ ! .`), and CJK terminal characters (`。 ！？`).

### 2.3 Corruption-Resistant State via AtomicFiles
BookReader avoids standard shared preferences or non-atomic file writes for critical state:
- Utilizes Android's `AtomicFile` Scoped Storage abstraction for all bookmark indices, custom CSS styles, and userscript configurations.
- Writes to a staging temporary file before executing an atomic filesystem rename, guaranteeing that unexpected battery exhaustion or process termination never leaves behind a zero-byte or corrupt JSON file.

### 2.4 Jsoup Scraping & Userscript Extensibility
- Implements a modular DOM parser using Jsoup that extracts chapter content from public web sources while stripping advertisements, hidden tracking scripts, and formatting artifacts.
- Supports customizable userscripts allowing readers to define tailored CSS selectors for unique web novel layouts.

---

## 3. Latest Release & Distribution

- **Current Version**: `v3.4.0` (Latest stable release)
- **Primary Package**: Direct one-click APK download:
  - `app-release.apk` (~20.1 MB): Full standalone release with all native components bundled.
- **Update Channel**: `update-latest.apk` for continuous in-app update mechanisms.
- **Open Source Repository**: [github.com/faycalrafa/free-novel-reader-tts-android](https://github.com/faycalrafa/free-novel-reader-tts-android)
- **Interactive In-Browser Simulator**: Test the quote-aware sentence chunking engine directly in your browser on the [Dedicated BookReader Showcase](/projects/bookreader).
