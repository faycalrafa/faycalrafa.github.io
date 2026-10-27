// src/data/commands.ts
// Command definitions and icons for the Command Palette (F06)

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Actions' | 'Projects' | 'Social & Links';
  badge?: string;
  badgeColor?: string;
  keywords: string[];
  icon: string;
  action: () => void;
}

export const icons = {
  home: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M8 18v-6h4v6"/></svg>`,
  briefcase: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="11" rx="2"/><path d="M7 6V4a2 2 0 012-2h2a2 2 0 012 2v2"/><path d="M3 11h14"/></svg>`,
  code: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7l-4 3 4 3"/><path d="M14 7l4 3-4 3"/><path d="M11 4l-2 12"/></svg>`,
  folder: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/></svg>`,
  book: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17.5v-13A2.5 2.5 0 016.5 2H16v16H6.5A2.5 2.5 0 004 20v-2.5z"/><path d="M6 6h6M6 10h6"/></svg>`,
  mail: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M3 5l7 5 7-5"/></svg>`,
  sun: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  download: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3v10M6 9l4 4 4-4M3 15v1a2 2 0 002 2h10a2 2 0 002-2v-1"/></svg>`,
  external: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 3h6v6M10 10l7-7M8 5H4a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-4"/></svg>`,
  eye: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="3"/><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/></svg>`,
  copy: `<svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M3 13V5a2 2 0 012-2h8"/></svg>`,
};

function navigateTo(url: string) {
  window.location.href = url;
}

function triggerCvDownload() {
  window.open('/cv', '_blank');
}

function openCvModal() {
  window.dispatchEvent(new CustomEvent('open-cv-modal'));
}

export function createCommandDefinitions(): CommandItem[] {
  return [
    // 1. Navigation Commands
    {
      id: 'nav-home',
      title: 'Home',
      subtitle: 'Navigate to hero section and introduction',
      category: 'Navigation',
      keywords: ['home', 'index', 'main', 'landing', 'faycal'],
      icon: icons.home,
      action: () => navigateTo('/'),
    },
    {
      id: 'nav-career',
      title: 'Career Timeline',
      subtitle: '7 companies: AUTOQUAL, SABIL, Finnetude, InstaClean, Kabri, PIASSA, BFLN',
      category: 'Navigation',
      keywords: ['career', 'timeline', 'experience', 'jobs', 'autoqual', 'sabil', 'finnetude', 'instaclean', 'kabri', 'piassa', 'bfln'],
      icon: icons.briefcase,
      action: () => navigateTo('/career'),
    },
    {
      id: 'nav-skills',
      title: 'Skills Matrix (Bento Grid)',
      subtitle: 'TypeScript, NestJS, Android Native, Media3, PostgreSQL, Docker',
      category: 'Navigation',
      keywords: ['skills', 'tech', 'stack', 'typescript', 'bento', 'grid', 'nestjs', 'compose', 'docker', 'postgresql'],
      icon: icons.code,
      action: () => navigateTo('/#skills'),
    },
    {
      id: 'nav-projects',
      title: 'Projects Archive',
      subtitle: 'Browse all hobby and commercial software projects',
      category: 'Navigation',
      keywords: ['projects', 'archive', 'portfolio', 'work', 'all', 'open-source'],
      icon: icons.folder,
      action: () => navigateTo('/projects'),
    },
    {
      id: 'nav-bookreader',
      title: 'BookReader Android Flagship Showcase',
      subtitle: 'Free & Open Source TTS novel reader with Jetpack Compose & Media3',
      category: 'Projects',
      badge: 'Hobby Project',
      badgeColor: 'amber',
      keywords: ['bookreader', 'flagship', 'hobby', 'android', 'tts', 'compose', 'media3', 'exoplayer', 'apk'],
      icon: icons.book,
      action: () => navigateTo('/projects/bookreader'),
    },
    {
      id: 'nav-textmorph',
      title: 'TextMorph Android On-Device AI',
      subtitle: 'System-wide multimodal AI assistant with multi-engine local LLM inference',
      category: 'Projects',
      badge: 'Open Source',
      badgeColor: 'purple',
      keywords: ['textmorph', 'ai', 'android', 'multi-engine', 'litert-lm', 'llamacpp', 'compose', 'llm', 'apk', 'assistant'],
      icon: icons.code,
      action: () => navigateTo('/projects/textmorph'),
    },
    {
      id: 'nav-contact',
      title: 'Contact Faycal Rafa',
      subtitle: 'Reach out via email or discuss engineering opportunities',
      category: 'Navigation',
      keywords: ['contact', 'email', 'hire', 'message', 'reach', 'talk'],
      icon: icons.mail,
      action: () => navigateTo('/#contact'),
    },

    // 2. Quick Actions
    {
      id: 'action-download-cv',
      title: 'Download CV (PDF)',
      subtitle: 'Direct download of official Faycal_Rafa_CV_2026.pdf document',
      category: 'Actions',
      badge: 'PDF',
      badgeColor: 'blue',
      keywords: ['cv', 'resume', 'pdf', 'download', 'curriculum', 'vitae', 'faycal rafa'],
      icon: icons.download,
      action: () => triggerCvDownload(),
    },
    {
      id: 'action-view-cv',
      title: 'Open CV Modal Viewer',
      subtitle: 'View the complete CV inline without leaving the page',
      category: 'Actions',
      badge: 'Viewer',
      keywords: ['cv', 'resume', 'modal', 'view', 'preview', 'inline', 'pdf'],
      icon: icons.eye,
      action: () => openCvModal(),
    },
    {
      id: 'action-download-apk',
      title: 'Download BookReader APK (v3.4.0)',
      subtitle: 'Download app-release.apk directly from latest GitHub release',
      category: 'Actions',
      badge: 'v3.4.0 • APK',
      badgeColor: 'emerald',
      keywords: ['apk', 'download', 'bookreader', 'android', 'install', 'release', 'v3.4.0'],
      icon: icons.download,
      action: () => {
        window.location.href = 'https://github.com/faycalrafa/free-novel-reader-tts-android/releases/download/v3.4.0/app-release.apk';
      },
    },
    {
      id: 'action-copy-email',
      title: 'Copy Email Address',
      subtitle: 'Copy rafafaycal@gmail.com to clipboard',
      category: 'Actions',
      keywords: ['copy', 'email', 'clipboard', 'mail', 'rafafaycal'],
      icon: icons.copy,
      action: () => {
        navigator.clipboard.writeText('rafafaycal@gmail.com');
      },
    },
    {
      id: 'action-toggle-theme',
      title: 'Toggle Theme (Dark / Light)',
      subtitle: 'Switch between Dark and Light mode',
      category: 'Actions',
      badge: 'Appearance',
      keywords: ['theme', 'dark', 'light', 'mode', 'appearance', 'toggle', 'color'],
      icon: icons.sun,
      action: () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark } }));
      },
    },

    // 3. Social & External Links
    {
      id: 'social-github',
      title: 'GitHub Profile',
      subtitle: 'https://github.com/faycalrafa',
      category: 'Social & Links',
      badge: 'External',
      keywords: ['github', 'profile', 'code', 'open-source', 'repos', 'git'],
      icon: icons.external,
      action: () => window.open('https://github.com/faycalrafa', '_blank'),
    },
    {
      id: 'social-linkedin',
      title: 'LinkedIn Profile',
      subtitle: 'Professional network & career updates',
      category: 'Social & Links',
      badge: 'External',
      keywords: ['linkedin', 'profile', 'network', 'career', 'connect'],
      icon: icons.external,
      action: () => window.open('https://linkedin.com/in/faycalrafa', '_blank'),
    },
  ];
}
