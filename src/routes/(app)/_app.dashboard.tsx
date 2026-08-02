import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SinistreStats from '@/components/SinistreStats'
import PVUploadSection from '@/components/PVUploadSection'
import PVsUploadZone from '@/components/PVsUploadZone'
import { fetchSinistres } from '#/api/fetch-sinistres'
import type { Sinitres } from '#/types/sinistres'

export const Route = createFileRoute('/(app)/_app/dashboard')({
  component: RouteComponent,
  staticData: {
    breadcrumb: { title: 'Dashboard', href: '/dashboard' },
  },
  loader: async (): Promise<{
    sinistres: Sinitres[]
    error: string | null
  }> => {
    try {
      const data = (await fetchSinistres()) as
        Sinitres[] | { results?: Sinitres[] }
      const sinistres = Array.isArray(data) ? data : (data.results ?? [])
      return { sinistres, error: null }
    } catch (error) {
      console.error('Error fetching sinistres:', error)
      return { sinistres: [], error: 'Impossible de charger les sinistres' }
    }
  },
})

const formatEuro = (value: number | null) =>
  value == null
    ? '—'
    : new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(value)

function RouteComponent() {
  const { sinistres, error } = Route.useLoaderData()

  const recent = [...sinistres]
    .sort(
      (a, b) =>
        new Date(b.date_accident).getTime() -
        new Date(a.date_accident).getTime(),
    )
    .slice(0, 5)

  return (
    <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Statistiques des sinistres et dépôt de PV
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Stats */}
      <SinistreStats sinistres={sinistres} />

      {/* Upload */}
      <PVUploadSection />

      {/* Bulk import */}
      <PVsUploadZone />

      <Separator className="bg-border/50" />

      {/* Recent sinistres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Derniers sinistres
          </CardTitle>
          <CardDescription>Les 5 sinistres les plus récents</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun sinistre enregistré pour le moment
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assuré</TableHead>
                  <TableHead>Sinistre</TableHead>
                  <TableHead>Date accident</TableHead>
                  <TableHead className="text-right">Montant dommage</TableHead>
                  <TableHead className="text-right">HAIR TTC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((s) => (
                  <TableRow key={s.id ?? `${s.assure}-${s.date_accident}`}>
                    <TableCell className="font-medium">{s.assure}</TableCell>
                    <TableCell>{s.sinistre ?? '—'}</TableCell>
                    <TableCell>
                      {new Date(s.date_accident).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatEuro(s.montant_dommage)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatEuro(s.hair_ttc)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
