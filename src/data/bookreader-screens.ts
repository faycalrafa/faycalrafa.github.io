// src/data/bookreader-screens.ts
// Structured data for BookReader Android showcase screens

export interface BookReaderScreen {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  description: string;
  highlights: string[];
  tech: string;
}

export const APP_SCREENS: BookReaderScreen[] = [
  {
    id: 'home',
    num: '01',
    title: 'Library & Playlist Hub',
    subtitle: 'NovelArrow Reader Pro · Root Folder & Scoped Storage',
    tag: 'Storage & Playlists',
    image: '/images/bookreader/screenshot-01-home.jpg',
    description: 'Pick any root folder on your Android device. Every subfolder automatically becomes its own reading playlist with independently tracked chapter progression and offline text-to-speech audio state.',
    highlights: [
      'Automatic subfolder playlist indexing via Android Storage Access Framework',
      'Crash-proof chapter progress saving using AtomicFile',
      'Instant one-tap Resume directly from the home deck',
      'Offline-first architecture with zero mandatory network connectivity'
    ],
    tech: 'Kotlin Coroutines · AndroidX DocumentFile · AtomicFiles'
  },
  {
    id: 'voice-engine',
    num: '02',
    title: 'Neural Voice Engine',
    subtitle: 'On-Device AI Voices · Kokoro, Piper & KittenTTS',
    tag: 'Speech Synthesis & AI',
    image: '/images/bookreader/screenshot-02-voice-engines.jpg',
    description: 'Switch effortlessly between Android built-in Google TTS (474 voices) and cutting-edge on-device neural voice bundles. Experience natural human-grade prosody without any cloud subscriptions or privacy exposure.',
    highlights: [
      'Kokoro TTS: State-of-the-art 82M open-weight neural model (88MB) delivering human-grade prosody',
      'Piper TTS: Ultra-fast neural voice engine with English, French, and Arabic voices (<65MB each)',
      'KittenTTS: Ultra-compact embedded on-device models (<30MB) for minimal battery drain',
      'Standard window.speechSynthesis and native Android TextToSpeech fallbacks'
    ],
    tech: 'On-Device Neural TTS · Piper C++ · Kokoro 82M · Android TextToSpeech'
  },
  {
    id: 'toolbar-settings',
    num: '03',
    title: 'Persistent Notification Media Bar',
    subtitle: 'AndroidX Media3 Foreground Service & Quick Controls',
    tag: 'Background Audio',
    image: '/images/bookreader/screenshot-03-toolbar-settings.jpg',
    description: 'A customized, quick-access reader bar pinned directly in your Android notification shade and lock screen. Keeps playback alive even after closing the app with battery optimization unrestricted.',
    highlights: [
      'Live notification bar preview showing chapter progress, rate (1.25x), and sleep timer',
      'One-tap button toggles: reading speed cycling, sleep timer presets (15m, 30m, 1h)',
      'Previous/Next chapter jumping and live web chapter sync directly from notification',
      'Persistent foreground service surviving aggressive OS background task killers'
    ],
    tech: 'AndroidX Media3 · MediaSessionService · Foreground Service'
  },
  {
    id: 'audio-studio',
    num: '04',
    title: 'Audio Studio & Audiobook Generator',
    subtitle: 'Offline Chapter Synthesis & Standalone MP3 Tracks',
    tag: 'Audio Generation',
    image: '/images/bookreader/screenshot-04-audio-studio.jpg',
    description: 'Transform full web novel chapters into standalone MP3 audiobooks stored in local audio folders. Listen with the integrated chapter seekbar, speed adjustments (0.5×–2.5×), and background progress tracking.',
    highlights: [
      'Batch synthesis of novel text into clean MP3 audio files with track size tracking',
      'Built-in playback deck with chapter scrub bar, audio speed modifier, and sleep timer',
      'Organized folder playlists for continuous multi-chapter listening',
      'Full background audio focus management for incoming calls and notifications'
    ],
    tech: 'Background Synthesis Worker · MediaCodec · ExoPlayer'
  },
  {
    id: 'live-web-tts',
    num: '05',
    title: 'Live Web TTS & Reader',
    subtitle: 'In-App Web Scraper & Article Audio Player',
    tag: 'Web Scraping',
    image: '/images/bookreader/screenshot-05-live-web-tts.jpg',
    description: 'Integrated in-app browser with Jsoup DOM pipeline that strips ads, banners, and clutter from online novels and news sites. Streams clean extracted text straight into the live TTS audio player overlay.',
    highlights: [
      'Real-time content extraction with custom CSS selector filters',
      'Live Web TTS audio player dock with chapter progress (e.g. 15/49 chunks, 30%)',
      'Instant rate switching (1.75×) and chapter pagination buttons',
      'Clean typography reading mode optimized for sepia and dark OLED screens'
    ],
    tech: 'Jsoup HTML Parser · WebKit WebView · Reactive Live Chunker'
  }
];
