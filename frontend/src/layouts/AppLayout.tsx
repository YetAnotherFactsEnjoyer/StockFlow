import type { ReactNode } from 'react';

import { WorkspaceTheme } from '../features/onboarding/components/WorkspaceTheme';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <WorkspaceTheme />
      <div className="flex min-h-screen min-w-[720px] items-start bg-app-bg">
        <AppSidebar />
        <main className="min-h-screen min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
