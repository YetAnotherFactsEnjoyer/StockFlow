import { useEffect } from 'react';

import { useOnboarding } from '../context/useOnboarding';

export function WorkspaceTheme() {
  const { state } = useOnboarding();

  useEffect(() => {
    const root = document.documentElement;
    const colorMode = state.branding.colorMode;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    root.style.setProperty(
      '--workspace-primary',
      state.branding.primaryColor,
    );

    root.style.setProperty(
      '--workspace-accent',
      state.branding.accentColor,
    );

    function applyColorMode() {
      const dark =
        colorMode === 'dark' ||
        (colorMode === 'system' && media.matches);

      root.classList.toggle('dark', dark);
      root.dataset.theme = dark ? 'dark' : 'light';
      root.style.colorScheme = dark ? 'dark' : 'light';
    }

    applyColorMode();
    media.addEventListener('change', applyColorMode);

    return () => {
      media.removeEventListener('change', applyColorMode);
      root.style.removeProperty('--workspace-primary');
      root.style.removeProperty('--workspace-accent');
      root.style.removeProperty('color-scheme');
      root.classList.remove('dark');
      delete root.dataset.theme;
    };
  }, [
    state.branding.primaryColor,
    state.branding.accentColor,
    state.branding.colorMode,
  ]);

  return null;
}
