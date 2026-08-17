import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createSession, listTrainings } from '../../services/training.service'
import type { Training } from '../../types'
import { getErrorMessage } from '../../utils/error'

interface Props {
  open: boolean
  trainingId?: string
  onClose: () => void
  onSaved: () => void
}

export default function SessionFormDialog({ open, trainingId, onClose, onSaved }: Props) {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [selectedTraining, setSelectedTraining] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelectedTraining(trainingId ?? '')
    setStartAt('')
    setEndAt('')
    setLocation('')
    setNotes('')
    setError(null)
    listTrainings().then(setTrainings).catch((err) => setError(getErrorMessage(err)))
  }, [open, trainingId])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      await createSession({
        trainingId: selectedTraining,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        location: location.trim() || null,
        notes: notes.trim() || null,
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar a sessão.'))
    } finally {
      setIsSaving(false)
    }
  }

  const isValid = selectedTraining && startAt && endAt && new Date(endAt) > new Date(startAt)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nova sessão</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              select
              label="Treinamento"
              value={selectedTraining}
              onChange={(event) => setSelectedTraining(event.target.value)}
              disabled={Boolean(trainingId)}
              required
            >
              {trainings.map((training) => (
                <MenuItem key={training.id} value={training.id}>
                  {training.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Início"
              type="datetime-local"
              value={startAt}
              onChange={(event) => setStartAt(event.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Término"
              type="datetime-local"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Local"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <TextField
              label="Observações"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSaving || !isValid}>
            {isSaving ? 'Salvando...' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}