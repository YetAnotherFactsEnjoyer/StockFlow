import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { router } from './app/router/router';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The root HTML element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
