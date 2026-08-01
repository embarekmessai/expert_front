import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/AppShell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import Main from '../main';

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <Main>
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    {/* <AppSidebarHeader breadcrumbs={breadcrumbs} /> */}
                    {children}
                </AppContent>
            </AppShell>
        </Main>
    );
}
