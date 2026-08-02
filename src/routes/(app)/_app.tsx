import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                {/* <AppSidebarHeader breadcrumbs={breadcrumbs} /> */}

                <Outlet />
            </AppContent>
        </AppShell>
    </main>
  )
}

import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/AppShell';
import { AppSidebar } from '@/components/app-sidebar';
import type { AppLayoutProps } from '@/types';

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <main>
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    {/* <AppSidebarHeader breadcrumbs={breadcrumbs} /> */}
                    {children}
                </AppContent>
            </AppShell>
        </main>
    );
}
