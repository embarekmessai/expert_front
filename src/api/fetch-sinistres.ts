import { createServerFn } from '@tanstack/react-start'
import getSinistres from '#/api/sinistres'

export const fetchSinistres = createServerFn().handler(getSinistres)
