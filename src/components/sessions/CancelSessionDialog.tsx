import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { cancelSession } from '../../services/training.service'
import type { TrainingSession } from '../../types'
import { getErrorMessage } from '../../utils/error'

interface Props {
  open: boolean
  session: TrainingSession | null
  onClose: () => void
  onSaved: () => void
}

export default function CancelSessionDialog({ open, session, onClose, onSaved }: Props) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setReason('')
      setError(null)
    }
  }, [open])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session) return
    setError(null)
    setIsSaving(true)
    try {
      await cancelSession(session.id, reason.trim())
      onSaved()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível cancelar a sessão.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Cancelar sessão</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="body2" color="text.secondary">
              Esta ação registra o cancelamento e o motivo no histórico.
            </Typography>
            <TextField
              label="Motivo"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              multiline
              minRows={2}
              required
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Voltar</Button>
          <Button type="submit" variant="contained" color="error" disabled={isSaving || !reason.trim()}>
            {isSaving ? 'Cancelando...' : 'Confirmar cancelamento'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}