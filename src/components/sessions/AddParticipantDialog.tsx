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
import { addParticipant } from '../../services/training.service'
import { listUsers, type UserOption } from '../../services/user.service'
import { getErrorMessage } from '../../utils/error'

interface Props {
  open: boolean
  sessionId: string
  existingUserIds: string[]
  onClose: () => void
  onSaved: () => void
}

export default function AddParticipantDialog({
  open,
  sessionId,
  existingUserIds,
  onClose,
  onSaved,
}: Props) {
  const [technicians, setTechnicians] = useState<UserOption[]>([])
  const [userId, setUserId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setUserId('')
    setError(null)
    listUsers()
      .then((users) =>
        setTechnicians(
          users.filter(
            (user) =>
              user.role === 'TECHNICIAN' &&
              user.isActive &&
              user.teamId &&
              !existingUserIds.includes(user.id),
          ),
        ),
      )
      .catch((err) => setError(getErrorMessage(err)))
  }, [open, existingUserIds])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      await addParticipant(sessionId, userId)
      onSaved()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível adicionar o participante.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Adicionar participante</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              select
              label="Técnico"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              helperText="Somente técnicos de teams associados ao treinamento são aceitos pela API."
              required
            >
              {technicians.length === 0 && (
                <MenuItem value="" disabled>
                  Nenhum técnico disponível
                </MenuItem>
              )}
              {technicians.map((technician) => (
                <MenuItem key={technician.id} value={technician.id}>
                  {technician.name}
                  {technician.teamName ? ` — ${technician.teamName}` : ''}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSaving || !userId}>
            {isSaving ? 'Salvando...' : 'Adicionar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}