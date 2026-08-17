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
import { createTraining } from '../../services/training.service'
import { TRAINING_TYPES, type TrainingType } from '../../types'
import { getErrorMessage } from '../../utils/error'
import { trainingTypeLabels } from '../../utils/labels'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export default function TrainingFormDialog({ open, onClose, onSaved }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TrainingType>('MANDATORY')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName('')
      setDescription('')
      setType('MANDATORY')
      setError(null)
    }
  }, [open])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      await createTraining({
        name: name.trim(),
        description: description.trim() || null,
        type,
      })
      onSaved()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar o treinamento.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Novo treinamento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoFocus
            />
            <TextField
              select
              label="Tipo"
              value={type}
              onChange={(event) => setType(event.target.value as TrainingType)}
            >
              {TRAINING_TYPES.map((option) => (
                <MenuItem key={option} value={option}>
                  {trainingTypeLabels[option]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Descrição"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSaving || !name.trim()}>
            {isSaving ? 'Salvando...' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}