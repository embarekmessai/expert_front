import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import StoreDevtools from '../../lib/demo-store-devtools'
import { Scripts } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/_web')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
      <Header />
        <Outlet />
      <Footer />
      <Scripts />
    </main>
  )
}
