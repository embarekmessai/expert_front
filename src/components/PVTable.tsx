import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Download, FileSpreadsheet, Hash, User, Car, Calendar,
  DollarSign, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getSinistresPage, getStats, downloadExcel } from '@/api/sinistres'
import { DataTable } from '@/components/data-table'
import type { DataTableColumn } from '@/components/data-table'
import type { Sinitres } from '#/types/sinistres'

const columns: DataTableColumn<Sinitres>[] = [
  {
    key: 'numero',
    header: <span className="text-muted-foreground">N°</span>,
    className: 'w-12 text-muted-foreground',
    cell: (pv) => (
      <span className="font-mono text-xs text-muted-foreground">{pv.sinistre}</span>
    ),
  },
  {
    key: 'assure',
    header: <span className="text-muted-foreground">Assuré</span>,
    cell: (pv) => (
      <div className="flex items-center gap-2">
        <User className="h-3.5 w-3.5 text-primary/70" />
        <span className="font-medium text-sm">{pv.assure}</span>
      </div>
    ),
  },
  {
    key: 'tiers',
    header: <span className="text-muted-foreground">Tiers</span>,
    cell: (pv) =>
      pv.tiers ? (
        <div className="flex items-center gap-2">
          <Car className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-sm text-muted-foreground">{pv.tiers}</span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground/40">—</span>
      ),
  },
  {
    key: 'sinistre',
    header: <span className="text-muted-foreground">Sinistre</span>,
    className: 'text-muted-foreground',
    cell: (pv) => (
      <span className="font-mono text-sm text-muted-foreground">{pv.sinistre}</span>
    ),
  },
  {
    key: 'date',
    header: <span className="text-muted-foreground">Date</span>,
    cell: (pv) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="text-sm text-muted-foreground">{pv.date_accident}</span>
      </div>
    ),
  },
  {
    key: 'dommages',
    header: <span className="text-muted-foreground">Dommages</span>,
    className: 'text-right text-muted-foreground',
    cell: (pv) =>
      pv.montant_dommage ? (
        <span className="font-mono text-sm text-foreground">
          {pv.montant_dommage.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground/40">—</span>
      ),
  },
  {
    key: 'hair_ttc',
    header: <span className="text-muted-foreground">H.TTC</span>,
    className: 'text-right text-muted-foreground',
    cell: (pv) => (
      <Badge variant="secondary" className="font-mono">
        {pv.hair_ttc}
      </Badge>
    ),
  },
]

const StatCard = ({ icon: Icon, label, value, suffix = '', accent = false }:
{ icon: LucideIcon, label: string, value: number | string, suffix?: string, accent?: boolean }) => (
  <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
    <div className="flex items-center gap-2 text-muted-foreground mb-2">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <div className={`text-2xl font-bold ${accent ? 'text-primary' : 'text-foreground'}`}>
      {value}{suffix}
    </div>
  </div>
)

export default function PVTable({ sinistres, error }: { sinistres: Sinitres[], error: string | null }) {
  const [stats, setStats] = useState<{
    total_lines: number
    total_hair_ttc: number
    last_row: number
  } | null>(null)

  useEffect(() => {
    getStats()
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setStats(data))
      .catch(() => {})
  }, [])

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Récapitulatif des PVs</CardTitle>
              <CardDescription>Données du fichier Excel en temps réel</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={downloadExcel}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger Excel
            </Button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <StatCard
              icon={Hash}
              label="Total Sinistres"
              value={stats.total_lines}
              accent
            />
            <StatCard
              icon={DollarSign}
              label="Honoraires TTC"
              value={stats.total_hair_ttc.toLocaleString('fr-FR')}
              suffix=" DA"
              accent
            />
            <StatCard
              icon={TrendingUp}
              label="Dernière ligne"
              value={stats.last_row}
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <DataTable<Sinitres>
          columns={columns}
          fetcher={getSinistresPage}
          rowKey={(pv) => pv.id ?? String(pv.sinistre)}
          initialPage={
            sinistres.length > 0 ? { results: sinistres } : undefined
          }
          error={error}
          emptyTitle="Aucun PV dans le fichier Excel"
          emptyDescription="Déposez un PDF pour commencer"
        />
      </CardContent>
    </Card>
  )
}
