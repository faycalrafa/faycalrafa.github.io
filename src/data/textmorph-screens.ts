// src/data/textmorph-screens.ts
// Showcase screens configuration for TextMorph Flagship

export interface AppScreen {
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

export const APP_SCREENS: AppScreen[] = [
  {
    id: 'floating-toolbar',
    num: '01',
    title: 'System-Wide Floating AI Toolbar',
    subtitle: 'AccessibilityService & WindowManager Non-Focusable Overlay',
    tag: 'Flagship Feature',
    image: '/images/textmorph/playstore-01-floating-toolbar.jpg',
    description: 'An intelligent floating capsule anchored directly above focused input fields across any Android application. It monitors text selection without stealing keyboard focus (FLAG_NOT_FOCUSABLE), allowing you to transform, rephrase, or translate text with a single tap inside WhatsApp, Gmail, Slack, and Chrome.',
    highlights: [
      'AccessibilityService window tracker monitoring focused text nodes',
      'FLAG_NOT_FOCUSABLE overlay window preserving keyboard interaction',
      'Instant in-place text replacement directly into the active editable buffer',
      'Non-intrusive floating pill draggable to any screen edge with spring snap'
    ],
    tech: 'AccessibilityService · WindowManager Overlay · FLAG_NOT_FOCUSABLE · AccessibilityNodeInfo'
  },
  {
    id: 'model-hub',
    num: '02',
    title: 'Hardware-Accelerated Model Hub',
    subtitle: 'Zero-Copy Linux mmap & Multi-Engine Inference (LiteRT-LM, llama.cpp)',
    tag: 'On-Device AI Engine',
    image: '/images/textmorph/playstore-02-model-hub.jpg',
    description: 'Load multi-gigabyte foundation models directly from your Downloads folder with zero file copying and instant mmap. Features a modular multi-engine architecture (Google LiteRT-LM, llama.cpp, and OpenAI-compatible APIs) capable of executing any open foundation LLM locally with mobile GPU/NPU acceleration.',
    highlights: [
      'Zero-copy memory mapping via ParcelFileDescriptor mmap directly into native buffers',
      'Multi-engine inference runtime with GPU acceleration (OpenCL/Vulkan) & CPU XNNPACK fallbacks',
      'Support for Google LiteRT-LM, llama.cpp GGUF quantization, and OpenAI-compatible endpoints',
      'Strict 100% on-device execution with zero cloud telemetry or data leakage'
    ],
    tech: 'Multi-Engine Runtime · LiteRT-LM · llama.cpp · Linux mmap · ParcelFileDescriptor · GPU/NPU Acceleration'
  },
  {
    id: 'slash-commands',
    num: '03',
    title: 'Custom Slash Commands Architecture',
    subtitle: 'Universal In-Field Macros (/fix, /summarize, /fr, /ar)',
    tag: 'Productivity & Macros',
    image: '/images/textmorph/playstore-03-slash-commands.jpg',
    description: 'Type /command directly inside any text field on your phone to trigger automated on-device AI pipelines. Translate to French (/fr), Arabic (/ar), English (/en), or execute bespoke multi-step prompt chains with the Quick Execute button.',
    highlights: [
      'Real-time text field watcher detecting leading slash trigger sequences',
      'Pre-configured high-accuracy translation prompts for Arabic, French, and English',
      'Custom slash command creator with dynamic prompt templating & variable injection',
      'Instant text replacement directly in the active editable buffer'
    ],
    tech: 'AccessibilityNodeInfo · TextWatcher · Coroutine Reactive Pipeline'
  },
  {
    id: 'custom-prompts',
    num: '04',
    title: 'Custom Prompts & Multimodal Vision',
    subtitle: 'Screen Assist, Creative Polish & Clipboard Actions',
    tag: 'Multimodal & Prompts',
    image: '/images/textmorph/playstore-04-custom-prompts.jpg',
    description: 'Tailor your AI assistant with personalized prompt chains. Pin your top 5 companion actions directly into the floating bar for single-tap execution. Use Screen Assist to take instant on-device screenshots and ask multimodal questions.',
    highlights: [
      'Top 5 companion slots directly accessible in the floating overlay bar',
      'Screen Assist vision action analyzing active screen context with on-device multimodal vision LLMs',
      'One-tap Clipboard Summarizer condensing copied documents into concise bullet points',
      'Intuitive drag-and-drop reordering with persistent room database storage'
    ],
    tech: 'MediaProjection · Multimodal Vision LLMs · Android Room · StateFlow'
  },
  {
    id: 'settings-server',
    num: '05',
    title: 'Localhost OpenAI-Compatible HTTP Server',
    subtitle: 'Embedded Ktor CIO Server on 127.0.0.1:8080',
    tag: 'Local Server & API',
    image: '/images/textmorph/playstore-05-settings-server.jpg',
    description: 'Turns your Android smartphone into a private edge LLM API server. Exposes standard OpenAI-compatible endpoints (/v1/chat/completions and /v1/models) over localhost for Termux automations, local scripts, and mobile companion tools.',
    highlights: [
      'Non-blocking Ktor CIO HTTP server bound exclusively to 127.0.0.1 for maximum privacy',
      'Standard OpenAI streaming chat completion protocol support (/v1/chat/completions)',
      'Direct integration with Termux curl scripts and local on-device developer workflows',
      'Real-time token generation telemetry, context size monitoring, and temperature controls'
    ],
    tech: 'Ktor CIO Server · Kotlinx Serialization · Server-Sent Events (SSE) · Localhost Only'
  }
];
