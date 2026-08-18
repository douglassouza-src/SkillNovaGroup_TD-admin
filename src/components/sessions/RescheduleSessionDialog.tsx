import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { rescheduleSession } from '../../services/training.service'
import type { TrainingSession } from '../../types'
import { toInputDateTime } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'

interface Props {
  open: boolean
  session: TrainingSession | null
  onClose: () => void
  onSaved: () => void
}

export default function RescheduleSessionDialog({ open, session, onClose, onSaved }: Props) {
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && session) {
      setStartAt(toInputDateTime(session.startAt))
      setEndAt(toInputDateTime(session.endAt))
      setReason('')
      setError(null)
    }
  }, [open, session])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!session) return
    setError(null)
    setIsSaving(true)
    try {
      await rescheduleSession(session.id, {
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        reason: reason.trim() || null,
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível reagendar a sessão.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Reagendar sessão</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Novo início"
              type="datetime-local"
              value={startAt}
              onChange={(event) => setStartAt(event.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />
            <TextField
              label="Novo término"
              type="datetime-local"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              required
            />
            <TextField
              label="Motivo (opcional)"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || !startAt || !endAt || new Date(endAt) <= new Date(startAt)}
          >
            {isSaving ? 'Salvando...' : 'Reagendar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}