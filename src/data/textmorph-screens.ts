// src/data/textmorph-screens.ts
// Showcase screens configuration for TextMorph Flagship (v4.2.1)

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
    id: 'floating-agent',
    num: '01',
    title: 'System-Wide Floating AI Agent',
    subtitle: 'Universal AccessibilityService & WindowManager Overlay Across Any App',
    tag: 'Everywhere Assistant',
    image: '/images/textmorph/playstore-01-floating-agent.jpg',
    description: 'A living, intelligent floating companion widget anchored over any Android application. Powered by a non-intrusive AccessibilityService and WindowManager overlay (FLAG_NOT_FOCUSABLE), it lets you trigger autonomous agent workflows, voice missions, or instant screen analysis over WhatsApp, YouTube, Chrome, or Settings without switching apps.',
    highlights: [
      'Living companion bubble with expressive visual status cues (thinking, acting, completed)',
      'Universal overlay functioning over any 3rd-party Android app without keyboard focus loss',
      'Single-tap screen assist & long-press quick autonomous agent mission trigger',
      'Non-intrusive draggable pill with smooth edge snapping and animated pulse halos'
    ],
    tech: 'AccessibilityService · WindowManager Overlay · FLAG_NOT_FOCUSABLE · Multi-Step Dispatcher'
  },
  {
    id: 'autonomous-agent',
    num: '02',
    title: 'Autonomous Agent Workspace',
    subtitle: 'Code-as-Action Multi-Step OS Navigation on Local Gemma 3 & 4',
    tag: 'Autonomous Agent',
    image: '/images/textmorph/playstore-02-autonomous-agent.jpg',
    description: 'Direct the local agent to automate real-world multi-step tasks across device apps. Using a Code-as-Action execution paradigm with deepest-leaf text matching, magnetic target snapping, and reticle overlays, it launches apps, inspects settings, searches feeds, and interacts with UI elements autonomously.',
    highlights: [
      'Code-as-Action execution engine interpreting natural language into concrete UI actions',
      'Magnetic target snapping with deepest-leaf node matching and click_element(id)',
      'Visual click trace dot and precision reticle overlay tracking real-time UI interactions',
      'Self-healing recovery engine with SkillMemoryService caching successful execution paths'
    ],
    tech: 'Code-as-Action · AccessibilityNodeInfo · TaskExecutor · SkillMemoryService · LiteRT-LM'
  },
  {
    id: 'conversation-workspace',
    num: '03',
    title: 'AI Conversation Workspace',
    subtitle: 'Dual Chat & Agent Switching with Local Context & Tool Integration',
    tag: 'Multimodal Chat',
    image: '/images/textmorph/playstore-03-conversation-workspace.jpg',
    description: 'An advanced conversational workspace featuring instant segmented switching between [Chat] and [Agent] modes. Direct local LiteRT-LM models to brainstorm, summarize, or debug, complete with user approval cards, follow-up suggestion chips, HTML sandbox rendering, and GIF trace export.',
    highlights: [
      'Instant segmented toggle between conversational reasoning [Chat] and [Agent] execution',
      'Interactive chat tools: user approval cards, follow-up suggestions, and HTML sandbox share',
      'Native Markdown formatting with syntax highlighting, token speed counters, and thinking toggle',
      '100% on-device local execution on gemma3-1b-it-int4 with zero cloud dependencies'
    ],
    tech: 'LiteRT-LM · Jetpack Compose M3 · HTML Sandbox · GIF Encoder · Mutex Session Queuing'
  },
  {
    id: 'navigation-telemetry',
    num: '04',
    title: 'Hardware Telemetry & Command Center',
    subtitle: 'Live CPU, RAM & Thermals, Voice Automations & Wake-Word Studio',
    tag: 'System Telemetry',
    image: '/images/textmorph/playstore-04-navigation-telemetry.jpg',
    description: 'A slide-out command drawer featuring real-time on-device hardware telemetry (LiteRT CPU load, active RAM allocation, and thermal temperatures) alongside quick access to Voice Agent Missions, Custom Prompts, Offline Wake-Word Studio, and Agent Tools.',
    highlights: [
      'Real-time on-device hardware telemetry monitoring RAM footprint (5.7GB), CPU load, and thermals (38°C)',
      'Offline Wake-Word Studio powered by Sherpa-ONNX with 3-attempt acoustic calibration ("Computer", "Hey Tamim")',
      'Voice & Automations hub managing AI script generators, hotkeys, and automated triggers',
      'Agent Tools sandbox with built-in action tester and JavaScript plugin runtime preview'
    ],
    tech: 'Sherpa-ONNX KWS · Hardware Profiler · VoiceTriggerDispatcher · AppLogger Near-Logging'
  },
  {
    id: 'model-hub',
    num: '05',
    title: 'Hardware-Accelerated Model Hub',
    subtitle: 'Zero-Copy Linux mmap for Gemma 4 (Vision) & Gemma 3 LiteRT-LM',
    tag: 'On-Device AI Engine',
    image: '/images/textmorph/playstore-05-model-hub.jpg',
    description: 'High-performance model manager supporting Gemma 4 (2.41GB / 3.41GB with Vision) and Gemma 3 (1B int4 at 557MB). Loads multi-gigabyte models directly from the user Downloads folder with zero file copying via Linux mmap and ParcelFileDescriptor, with OpenAI cloud fallbacks.',
    highlights: [
      'Zero-copy memory mapping via ParcelFileDescriptor mmap directly from /sdcard/Download',
      'Support for Google LiteRT-LM (Gemma 4 Vision, Gemma 3 1B) and universal GGUF quantization',
      'Hardware-accelerated mobile GPU inference with automatic CPU XNNPACK multi-threaded fallback',
      'Custom system prompt inspector directing model persona and agent execution rules'
    ],
    tech: 'LiteRT-LM GPU Runtime · Linux mmap · ParcelFileDescriptor · Gemma 4 Vision · OpenAI API'
  }
];
