export const semanticTokens = {
  colors: {
    'bg-body': {
      default: '#f4f5f8',
      _dark: '#0a0a0f',
    },
    'bg-body-inverse': {
      default: 'rgba(0, 0, 0, 0.90)',
      _dark: 'gray.50',
    },
    'bg-contrast-xs': {
      default: 'rgba(0, 30, 50, 0.0125)',
      _dark: 'rgba(255, 255, 255, 0.03)',
    },
    'bg-contrast-sm': {
      default: 'rgba(0, 30, 50, 0.025)',
      _dark: 'rgba(255, 255, 255, 0.05)',
    },
    'bg-contrast-md': {
      default: 'rgba(0, 30, 50, 0.05)',
      _dark: 'rgba(255, 255, 255, 0.08)',
    },
    'bg-contrast-lg': {
      default: 'rgba(0, 30, 50, 0.075)',
      _dark: 'rgba(255, 255, 255, 0.11)',
    },
    'bg-contrast-xl': {
      default: 'rgba(0, 30, 50, 0.1)',
      _dark: 'rgba(255, 255, 255, 0.14)',
    },
    'bg-contrast-overlay': {
      default: 'rgba(255, 255, 255, 0.82)',
      _dark: 'rgba(10, 10, 18, 0.87)',
    },
    'bg-overlay': {
      default: 'rgba(237, 242, 247, .98)',
      _dark: 'rgba(18, 18, 28, 0.55)',
    },
    'bg-modal': {
      default: 'rgb(255, 255, 255)',
      _dark: 'rgba(18, 18, 28, 0.92)',
    },
    'text-contrast-xs': {
      default: 'blackAlpha.500',
      _dark: 'whiteAlpha.500',
    },
    'text-contrast-sm': {
      default: 'blackAlpha.600',
      _dark: 'whiteAlpha.600',
    },
    'text-contrast-md': {
      default: 'blackAlpha.700',
      _dark: 'whiteAlpha.700',
    },
    'text-contrast-lg': {
      default: 'blackAlpha.800',
      _dark: 'whiteAlpha.850',
    },
    'text-contrast-xl': {
      default: 'blackAlpha.900',
      _dark: 'whiteAlpha.950',
    },
    'border-contrast-xs': {
      default: 'rgba(0, 0, 0, 0.1)',
      _dark: 'rgba(190, 150, 255, 0.14)',
    },
    'border-contrast-sm': {
      default: 'rgba(0, 0, 0, 0.2)',
      _dark: 'rgba(190, 150, 255, 0.22)',
    },
    'border-contrast-md': {
      default: 'rgba(0, 0, 0, 0.3)',
      _dark: 'rgba(190, 150, 255, 0.32)',
    },
    'border-contrast-lg': {
      default: 'rgba(0, 0, 0, 0.4)',
      _dark: 'rgba(190, 150, 255, 0.45)',
    },
    'border-contrast-xl': {
      default: 'rgba(0, 0, 0, 0.5)',
      _dark: 'rgba(190, 150, 255, 0.6)',
    },
    active: {
      default: 'purple.300',
      _dark: '#c9a8ff',
    },
    glow: {
      default: 'rgba(159, 122, 234, 0.35)',
      _dark: 'rgba(180, 140, 255, 0.55)',
    },
  },
  borders: {
    sm: `1px solid var(--chakra-colors-border-contrast-xs)`,
    md: `1px solid var(--chakra-colors-border-contrast-sm)`,
    lg: `1px solid var(--chakra-colors-border-contrast-md)`,
    error: `1px solid var(--chakra-colors-red-500)`,
  },
  shadows: {
    'glow-sm': {
      default: '0 0 0 1px rgba(159, 122, 234, 0.15)',
      _dark: '0 0 12px 0 var(--chakra-colors-glow), 0 0 0 1px var(--chakra-colors-border-contrast-xs)',
    },
    'glow-md': {
      default: '0 4px 20px -4px rgba(0, 0, 0, 0.15)',
      _dark: '0 0 24px -2px var(--chakra-colors-glow), 0 8px 32px -8px rgba(0, 0, 0, 0.6)',
    },
  },
};

if (typeof window !== 'undefined') {
  const updateViewportUnits = () => {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  };
  updateViewportUnits();
  window.addEventListener('resize', updateViewportUnits);
}
