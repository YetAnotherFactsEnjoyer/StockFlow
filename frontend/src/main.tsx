import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@material-tailwind/react';
import { RouterProvider } from '@tanstack/react-router';
import { OnboardingProvider } from './features/onboarding/context/OnboardingProvider';

import { router } from './app/router/router';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The root HTML element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider value={{}}>
      <OnboardingProvider>
        <RouterProvider router={router} />
      </OnboardingProvider>
    </ThemeProvider>
  </StrictMode>,
);
