import type { ReactNode } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';

import { WorkspaceTheme } from '../features/onboarding/components/WorkspaceTheme';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.996,
    filter: 'blur(3px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = useRouterState({ select: (routerState) => routerState.location.pathname });
  const reduceMotion = useReducedMotion();
  const sectionKey = pathname.startsWith('/products')
    ? 'products'
    : pathname.startsWith('/suppliers')
      ? 'suppliers'
      : 'overview';

  return (
    <>
      <WorkspaceTheme />
      <div className="flex min-h-screen min-w-0 items-start bg-app-bg">
        <AppSidebar />
        <main className="min-h-screen min-w-0 flex-1 overflow-x-clip pb-20 pt-16 md:pb-0 md:pt-0">
          <motion.div
            key={sectionKey}
            className="min-h-full will-change-[transform,opacity]"
            variants={pageVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.3, ease: 'easeOut' },
                    y: { type: 'spring', stiffness: 190, damping: 25, mass: 0.75 },
                    scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    filter: { duration: 0.28, ease: 'easeOut' },
                  }
            }
          >
            {children}
          </motion.div>
        </main>
      </div>
    </>
  );
}
