import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, FileCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function UploadZone({ onParsed, onError } : { onParsed: (data: any, file: File) => void, onError: (msg: string) => void }) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]

    setIsUploading(true)
    try {
      const { parsePV } = await import('@/api/sinistres')
      const res = await parsePV(file)
      onParsed(res.data.data, file)
    } catch (err) {
      onError(err.response?.data?.detail || err.message)
    } finally {
      setIsUploading(false)
    }
  }, [onParsed, onError])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: isUploading,
  })

  const file = acceptedFiles[0]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">Déposer un PV PDF</CardTitle>
          </div>
          {isUploading && (
            <Badge variant="secondary" className="animate-pulse">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Analyse...
            </Badge>
          )}
        </div>
        <CardDescription>
          Glissez-déposez un PV ou cliquez pour sélectionner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer",
            isDragActive && !isDragReject && "border-primary bg-primary/5",
            isDragReject && "border-destructive bg-destructive/5",
            !isDragActive && !file && "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30",
            file && !isUploading && "border-primary/50 bg-primary/5",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Analyse du PDF en cours...</p>
                <p className="text-xs text-muted-foreground mt-1">Extraction des données automatique</p>
              </div>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB • Prêt à l'ajout
                </p>
              </div>
              <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 mt-1">
                <CheckCircle className="mr-1 h-3 w-3" />
                Fichier chargé
              </Badge>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isDragActive ? 'Déposez le PDF ici' : 'Glissez-déposez un PV PDF'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ou cliquez pour parcourir vos fichiers
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                <AlertCircle className="h-3 w-3" />
                <span>Uniquement des fichiers PDF</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}