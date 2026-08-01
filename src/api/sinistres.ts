import type { Sinitres } from '../types/sinistres';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const getSinistres = async (): Promise<{ results: Sinitres[] }> => {
    const response = await fetch(API_URL + '/sinistres', {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sinistres: ${response.statusText}`)
    }

    return response.json()
};

export const parsePV = async(files: File[]): Promise<any> => {
  const formData = new FormData()
  files.forEach(file => formData.append('file', file))
  return fetch(API_URL + '/parse', {
    method: 'POST',
    body: formData,
  })
}

export const addPV = (file: File, data: Sinitres | null = null) => {
    const formData = new FormData()
    formData.append('file', file)
    if (data?.assure) formData.append('assure', data.assure)
    if (data?.tiers) formData.append('tiers', data.tiers)
    if (data?.sinistre) formData.append('sinistre', data.sinistre)
    if (data?.date_accident) formData.append('date_accident', data.date_accident)
    if (data?.montant_dommage !== undefined && data?.montant_dommage !== null) formData.append('montant_dommage', data.montant_dommage.toString())
    
    const response = fetch(API_URL + '/add', {
        method: 'POST',
        body: formData,
    })
    return response;
}

export const addManualPV = (data: Sinitres) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value.toString())
  })
  return fetch(API_URL + '/add-manual', {
    method: 'POST',
    body: formData,
  })
}

export const getStats = () => fetch(API_URL + '/stats')
export const getPVs = () => fetch(API_URL + '/pvs')
export const downloadExcel = () => {
  window.open(`${API_URL}/download`, '_blank')
}
export const uploadExcel = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return fetch(API_URL + '/upload-excel', {
    method: 'POST',
    body: formData,
  })
}

export default getSinistres