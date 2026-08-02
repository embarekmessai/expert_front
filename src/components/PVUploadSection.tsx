import { useCallback, useState } from 'react'
import { FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import UploadZone from '@/components/UploadZone'
import PVPreview from '@/components/PVPreview'

export default function PVUploadSection() {
  const [parsedData, setParsedData] = useState<any>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleParsed = useCallback(
    (data: any, file: File) => {
      setParsedData(data)
      setCurrentFile(file)
      setUploadError(null)

      const missing = data?.missing_fields || []
      if (missing.length > 0) {
        toast({
          title: 'Champs à vérifier',
          description: `${missing.length} champ${missing.length > 1 ? 's' : ''} non détecté${missing.length > 1 ? 's' : ''} automatiquement`,
          variant: 'warning',
        })
      } else {
        toast({
          title: 'PV analysé',
          description: 'Tous les champs ont été détectés automatiquement',
          variant: 'success',
        })
      }
    },
    [toast],
  )

  const handleError = useCallback(
    (msg: string) => {
      setUploadError(msg)
      setParsedData(null)
      setCurrentFile(null)
      toast({
        title: 'Erreur',
        description: msg,
        variant: 'error',
      })
    },
    [toast],
  )

  const handleSuccess = useCallback(() => {
    setParsedData(null)
    setCurrentFile(null)
    toast({
      title: 'Succès',
      description: 'Le PV a été ajouté au fichier Excel',
      variant: 'success',
    })
  }, [toast])

  const handleCancel = useCallback(() => {
    setParsedData(null)
    setCurrentFile(null)
    setUploadError(null)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <UploadZone onParsed={handleParsed} onError={handleError} />

      {parsedData && currentFile ? (
        <PVPreview
          data={parsedData}
          file={currentFile}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="mb-1 text-sm font-medium text-foreground">
              Aperçu du PV
            </p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Déposez un PDF à gauche pour voir les données extraites et les
              ajouter au fichier Excel
            </p>
            {uploadError && (
              <div className="mt-4 max-w-xs rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {uploadError}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
