import { useState } from 'react'
import { FileCheck, AlertTriangle, Save, X, Edit3, Eye, Loader2, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { addPV } from '@/api/sinistres'
import type { Sinitres } from '#/types/Sinitres'

type PVPreviewProps = {
  data: Pick<Sinitres, 'assure' | 'tiers' | 'sinistre' | 'date_accident' | 'montant_dommage'> & { missing_fields: string[] }
  file: File
  onSuccess?: (data: any) => void
  onCancel?: () => void
}

export default function PVPreview({ data, file, onSuccess, onCancel }: PVPreviewProps) {
  const [formData, setFormData] = useState<{
    assure: string
    tiers: string
    sinistre: string
    date_accident: string
    montant_dommage: number | string | null
  }>({
    assure: data?.assure || '',
    tiers: data?.tiers || '',
    sinistre: data?.sinistre || '',
    date_accident: data?.date_accident || '',
    montant_dommage: data?.montant_dommage || null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const missingFields = data?.missing_fields || []
  const hasMissing = missingFields.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
        const payload = {
            ...formData,
            montant_dommage: formData.montant_dommage ? parseFloat(formData.montant_dommage as string) : undefined,
        }
        const res = await addPV(file as File, payload as Sinitres)
        setSuccess(res)
        onSuccess?.(res)
    } catch (err: any) {
        setError(err.response?.data?.detail || err.message)
    } finally {
        setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <CardTitle className="text-base font-semibold text-emerald-500">PV ajouté avec succès !</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-xs text-muted-foreground">Ligne n°</p>
              <p className="text-lg font-bold text-foreground">{success.line_number}</p>
            </div>
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-xs text-muted-foreground">Nouveau total</p>
              <p className="text-lg font-bold text-primary">{success.total_amount?.toLocaleString('fr-FR')} DA</p>
            </div>
          </div>
          <div className="rounded-lg bg-background/50 p-3 space-y-1">
            <p className="text-xs text-muted-foreground">Assuré</p>
            <p className="font-medium text-foreground">{success.pv_data?.assure}</p>
            <p className="text-xs text-muted-foreground mt-2">Sinistre</p>
            <p className="font-mono text-sm text-foreground">{success.pv_data?.sinistre}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onCancel} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Ajouter un autre PV
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Eye className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Aperçu du PV</CardTitle>
              <CardDescription>Vérifiez et corrigez les données extraites</CardDescription>
            </div>
          </div>
          {hasMissing ? (
            <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {missingFields.length} champ{missingFields.length > 1 ? 's' : ''} à vérifier
            </Badge>
          ) : (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Tous les champs détectés
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assure" className="flex items-center gap-1.5">
              Assuré
              {missingFields.includes('assure') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Non détecté automatiquement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Label>
            <div className="relative">
              <Input
                id="assure"
                name="assure"
                value={formData.assure}
                onChange={handleChange}
                placeholder="NOM PRENOM"
                className={missingFields.includes('assure') ? 'border-amber-500/50 focus-visible:ring-amber-500/30' : ''}
              />
              <Edit3 className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiers">Tiers</Label>
            <Input
              id="tiers"
              name="tiers"
              value={formData.tiers}
              onChange={handleChange}
              placeholder="NOM PRENOM (optionnel)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sinistre" className="flex items-center gap-1.5">
              N° Sinistre
              {missingFields.includes('sinistre') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Non détecté automatiquement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Label>
            <Input
              id="sinistre"
              name="sinistre"
              value={formData.sinistre}
              onChange={handleChange}
              placeholder="260701XXXX"
              className={missingFields.includes('sinistre') ? 'border-amber-500/50 focus-visible:ring-amber-500/30' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_accident" className="flex items-center gap-1.5">
              Date Accident
              {missingFields.includes('date_accident') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Non détectée automatiquement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Label>
            <Input
              id="date_accident"
              name="date_accident"
              value={formData.date_accident}
              onChange={handleChange}
              placeholder="JJ/MM/AAAA"
              className={missingFields.includes('date_accident') ? 'border-amber-500/50 focus-visible:ring-amber-500/30' : ''}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="montant_dommage" className="flex items-center gap-1.5">
              Montant Dommages (DA)
              {missingFields.includes('montant_dommage') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Non détecté automatiquement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </Label>
            <Input
              id="montant_dommage"
              name="montant_dommage"
              type="number"
              step="0.01"
              value={formData.montant_dommage as string | undefined}
              onChange={handleChange}
              placeholder="0.00"
              className={missingFields.includes('montant_dommage') ? 'border-amber-500/50 focus-visible:ring-amber-500/30' : ''}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Ajouter au Excel
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
      </CardFooter>
    </Card>
  )
}