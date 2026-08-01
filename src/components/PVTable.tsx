import { useState, useEffect } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Download, RefreshCw, FileSpreadsheet, Hash, User, Car, Calendar,
  DollarSign, TrendingUp, AlertCircle
} from 'lucide-react'
import { getPVs, getStats, downloadExcel } from '@/api/sinistres'

export default function PVTable() {
  const [pvs, setPvs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pvsRes, statsRes] = await Promise.all([getPVs(), getStats()])
      setPvs(pvsRes.data.pvs || [])
      setStats(statsRes.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ icon: Icon, label, value, suffix = '', accent = false }) => (
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
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
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
              value={stats.total_hair_ttc?.toLocaleString('fr-FR')}
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
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-4">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        {loading && pvs.length === 0 ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : pvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Aucun PV dans le fichier Excel</p>
            <p className="text-xs text-muted-foreground mt-1">
              Déposez un PDF pour commencer
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-12 text-muted-foreground">N°</TableHead>
                    <TableHead className="text-muted-foreground">Assuré</TableHead>
                    <TableHead className="text-muted-foreground">Tiers</TableHead>
                    <TableHead className="text-muted-foreground">Sinistre</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-right text-muted-foreground">Dommages</TableHead>
                    <TableHead className="text-right text-muted-foreground">H.TTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pvs.slice().reverse().slice(0, 20).map((pv) => (
                    <TableRow key={pv.row} className="border-border/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {pv.num}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-primary/70" />
                          <span className="font-medium text-sm">{pv.assure}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {pv.tiers ? (
                          <div className="flex items-center gap-2">
                            <Car className="h-3.5 w-3.5 text-muted-foreground/50" />
                            <span className="text-sm text-muted-foreground">{pv.tiers}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {pv.sinistre}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span className="text-sm text-muted-foreground">{pv.date_accident}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {pv.montant_dommage ? (
                          <span className="font-mono text-sm text-foreground">
                            {pv.montant_dommage.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground/40">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-mono">
                          {pv.hair_ttc}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {pvs.length > 20 && (
              <div className="border-t border-border/50 px-4 py-3 text-center text-xs text-muted-foreground">
                Affichage des 20 derniers PVs sur {pvs.length} au total
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}