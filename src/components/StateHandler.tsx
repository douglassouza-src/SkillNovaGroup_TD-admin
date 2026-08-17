import { Alert, Box, CircularProgress } from '@mui/material'
import type { ReactNode } from 'react'
import EmptyState from './EmptyState'

interface Props {
  isLoading: boolean
  error?: string | null
  isEmpty?: boolean
  emptyMessage?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  children: ReactNode
}

export default function StateHandler({
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'Nenhum registro encontrado.',
  emptyDescription,
  emptyAction,
  children,
}: Props) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (isEmpty) {
    return (
      <EmptyState message={emptyMessage} description={emptyDescription} action={emptyAction} />
    )
  }

  return <>{children}</>
}