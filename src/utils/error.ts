import axios from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) return data.message
    if (error.response?.status === 401) return 'Credenciais inválidas.'
    if (!error.response) return 'Não foi possível conectar à API.'
  }
  return fallback
}