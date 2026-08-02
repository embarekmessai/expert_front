import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import type { BreadcrumbItem } from '@/types'
import { AppContent } from '@/components/app-content'
import { AppShell } from '@/components/AppShell'
import { AppSidebar } from '@/components/app-sidebar'
import { AppSidebarHeader } from '#/components/app-sidebar-header'
import { Toaster } from '@/components/ui/toaster'

export const Route = createFileRoute('/(app)/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  const matches = useMatches()
  const breadcrumbs: BreadcrumbItem[] = matches
    .map((match) => match.staticData?.breadcrumb)
    .filter((breadcrumb) => breadcrumb != null)

  return (
    <main>
      <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" className="overflow-x-hidden">
          <AppSidebarHeader breadcrumbs={breadcrumbs} />

          <Outlet />
          <Toaster />
        </AppContent>
      </AppShell>
    </main>
  )
}
