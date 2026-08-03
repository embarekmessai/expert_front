import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react'

export interface DataTableColumn<T> {
  /** Unique key, also used for the header label fallback */
  key: string
  /** Header content (string or node) */
  header: ReactNode
  /** Cell renderer */
  cell: (row: T, index: number) => ReactNode
  /** Extra classes on the header and cells (e.g. text-right) */
  className?: string
}

export interface DataTablePage<T> {
  results: T[]
  /** Total number of rows across all pages, if the API provides it */
  total?: number
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  /**
   * Server-side fetcher: called with (page, pageSize) and must resolve to the
   * page rows (and optionally the grand total).
   */
  fetcher: (page: number, pageSize: number) => Promise<DataTablePage<T>>
  pageSize?: number
  /** Key extractor for rows */
  rowKey: (row: T, index: number) => string | number
  /** Optional pre-loaded first page (e.g. from a route loader) */
  initialPage?: DataTablePage<T>
  /** External error to display (e.g. loader error) */
  error?: string | null
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<T>({
  columns,
  fetcher,
  pageSize = 20,
  rowKey,
  initialPage,
  error: externalError,
  emptyTitle = 'Aucune donnée',
  emptyDescription,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<T[]>(initialPage?.results ?? [])
  const [total, setTotal] = useState<number | undefined>(initialPage?.total)
  const [loading, setLoading] = useState(!initialPage)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (targetPage: number) => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetcher(targetPage, pageSize)
        setRows(result.results)
        setTotal(result.total)
        setPage(targetPage)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    },
    [fetcher, pageSize],
  )

  useEffect(() => {
    if (!initialPage) void load(1)
  }, [])

  const pageCount =
    total !== undefined ? Math.max(1, Math.ceil(total / pageSize)) : undefined
  const canPrev = page > 1 && !loading
  const canNext =
    !loading && (pageCount !== undefined ? page < pageCount : rows.length === pageSize)

  const displayError = externalError ?? error

  return (
    <div className="space-y-3">
      {displayError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {displayError}
          </div>
        </div>
      )}

      {loading && rows.length === 0 ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
          {emptyDescription && (
            <p className="text-xs text-muted-foreground mt-1">{emptyDescription}</p>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  {columns.map((col) => (
                    <TableHead key={col.key} className={col.className}>
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className={loading ? 'opacity-50 pointer-events-none' : undefined}>
                {rows.map((row, i) => (
                  <TableRow key={rowKey(row, i)} className="border-border/30">
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.cell(row, i)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
            <span className="text-xs text-muted-foreground">
              {total !== undefined
                ? `Page ${page} sur ${pageCount} — ${total} élément${total > 1 ? 's' : ''}`
                : `Page ${page}`}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void load(page - 1)}
                disabled={!canPrev}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void load(page + 1)}
                disabled={!canNext}
              >
                Suivant
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
