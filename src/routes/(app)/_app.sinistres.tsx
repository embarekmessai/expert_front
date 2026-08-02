// src/routes/fetch-movies.tsx
import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useCallback } from 'react'
import { createServerFn } from '@tanstack/react-start'
import getSinistres from '#/api/sinistres'
import { FileText, Zap, Shield, Sparkles, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import UploadZone from '@/components/UploadZone.tsx'
import PVPreview from '@/components/PVPreview.tsx'
import PVTable from '@/components/PVTable.tsx'
import type { Sinitres } from '#/types/sinistres'


const fetchSinistres = createServerFn().handler(
   getSinistres
)

const SinistresPage = () => {
  const [parsedData, setParsedData] = useState<Sinitres & { missing_fields?: string[] } | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState(null)
  const { toast } = useToast()

  const handleParsed = useCallback((data: Sinitres & { missing_fields?: string[] }, file: File) => {
    setParsedData(data)
    setCurrentFile(file)
    setUploadError(null)
    
    const missing = data?.missing_fields || []
    if (missing.length > 0) {
      toast({
        title: "Champs à vérifier",
        description: `${missing.length} champ${missing.length > 1 ? 's' : ''} non détecté${missing.length > 1 ? 's' : ''} automatiquement`,
        // variant: "warning",
      })
    } else {
      toast({
        title: "PV analysé",
        description: "Tous les champs ont été détectés automatiquement",
        // variant: "success",
      })
    }
  }, [toast])

  const handleError = useCallback((msg :any) => {
    setUploadError(msg)
    setParsedData(null)
    setCurrentFile(null)
    toast({
      title: "Erreur",
      description: msg,
      // variant: "destructive",
    })
  }, [toast])

  const handleSuccess = useCallback(() => {
    setParsedData(null)
    setCurrentFile(null)
    toast({
      title: "Succès",
      description: "Le PV a été ajouté au fichier Excel",
      // variant: "success",
    })
  }, [toast])

  const handleCancel = useCallback(() => {
    setParsedData(null)
    setCurrentFile(null)
    setUploadError(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                PV Excel Automation
              </h1>
              <p className="text-xs text-muted-foreground">
                Expertise Automobile — Messai Nour El Dinne
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Zap className="h-3 w-3 text-primary" />
              Auto-parse PDF
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <Shield className="h-3 w-3 text-emerald-500" />
              Backup auto
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <BarChart3 className="h-3 w-3 text-primary" />
              Stats live
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Hero / Intro */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Automatisation PV → Excel
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Déposez un PV, tout le reste est automatique
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Le système extrait automatiquement les données du PDF (assuré, sinistre, date, montant)
            et les ajoute au fichier Excel récapitulatif avec mise à jour des totaux.
          </p>
        </div>

        {/* Upload + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UploadZone onParsed={handleParsed} onError={handleError} />

          {parsedData ? (
            <PVPreview
              data={parsedData}
              file={currentFile}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center py-16">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                  <FileText className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Aperçu du PV
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Déposez un PDF à gauche pour voir les données extraites
                  et les ajouter au fichier Excel
                </p>
                {uploadError && (
                  <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive max-w-xs">
                    {uploadError}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="bg-border/50" />

        {/* Table */}
        <PVTable />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <p>PV Excel Automation — Développé pour Messai Nour El Dinne</p>
          <p className="hidden sm:block">React 19 • shadcn/ui • Tailwind CSS • FastAPI</p>
        </div>
      </footer>
    </div>
  )
}

export const Route = createFileRoute('/(app)/_app/sinistres')({
  component: SinistresPage,
  loader: async (): Promise<{ sinistres: Sinitres[]; error: string | null }> => {
    try {
      const sinistresData = await fetchSinistres()
      return { sinistres: sinistresData.results, error: null }
    } catch (error) {
      console.error('Error fetching sinistres:', error)
      return { sinistres: [], error: 'Failed to load sinistres' }
    }
  },
})  