import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from '@tanstack/react-router'
import {
  Upload,
  FileText,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Files,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { uploadPVs } from '@/api/sinistres'
import { cn } from '@/lib/utils'

export default function PVsUploadZone() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { 'application/pdf': ['.pdf'] },
      multiple: true,
      disabled: isUploading,
    })

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index))

  const handleUpload = async () => {
    if (files.length === 0) return
    setIsUploading(true)
    try {
      await uploadPVs(files)
      toast({
        title: 'PVs importés',
        description: `${files.length} fichier${files.length > 1 ? 's' : ''} traité${files.length > 1 ? 's' : ''} — sinistres créés`,
        variant: 'success',
      })
      setFiles([])
      await router.invalidate()
    } catch (err) {
      toast({
        title: 'Erreur',
        description:
          err instanceof Error ? err.message : "Échec de l'envoi des PVs",
        variant: 'error',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Files className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              Importer des PVs (création de sinistres)
            </CardTitle>
          </div>
          {files.length > 0 && (
            <Badge variant="secondary">
              {files.length} fichier{files.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <CardDescription>
          Sélectionnez un ou plusieurs PV PDF — chaque fichier crée un sinistre
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200',
            isDragActive && !isDragReject && 'border-primary bg-primary/5',
            isDragReject && 'border-destructive bg-destructive/5',
            !isDragActive &&
              'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30',
            isUploading && 'cursor-not-allowed opacity-50',
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragActive
                  ? 'Déposez les PDF ici'
                  : 'Glissez-déposez vos PV PDF'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                ou cliquez pour parcourir vos fichiers
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
              <AlertCircle className="h-3 w-3" />
              <span>Uniquement des fichiers PDF</span>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-sm text-foreground">
                    {file.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        {files.length > 0 && (
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Créer les sinistres ({files.length})
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
