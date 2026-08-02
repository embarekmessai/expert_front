import { FileText, Euro, TrendingUp, CalendarClock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Sinitres } from '#/types/sinistres'

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)

export default function SinistreStats({
  sinistres,
}: {
  sinistres: Sinitres[]
}) {
  const total = sinistres.length
  const totalDommages = sinistres.reduce(
    (sum, s) => sum + (s.montant_dommage ?? 0),
    0,
  )
  const totalHair = sinistres.reduce((sum, s) => sum + s.hair_ttc, 0)

  const now = new Date()
  const thisMonth = sinistres.filter((s) => {
    const d = new Date(s.date_accident)
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    )
  }).length

  const stats = [
    {
      title: 'Sinistres total',
      value: String(total),
      description: 'PV enregistrés',
      icon: FileText,
    },
    {
      title: 'Montant dommages',
      value: formatEuro(totalDommages),
      description: 'Cumul des montants',
      icon: Euro,
    },
    {
      title: 'HAIR TTC',
      value: formatEuro(totalHair),
      description: 'Cumul honoraires',
      icon: TrendingUp,
    },
    {
      title: 'Ce mois-ci',
      value: String(thisMonth),
      description: now.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      }),
      icon: CalendarClock,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
