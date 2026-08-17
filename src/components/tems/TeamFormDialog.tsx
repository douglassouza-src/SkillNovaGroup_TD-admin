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
import { createTeam, updateTeam } from '../../services/team.service'
import type { Team } from '../../types'
import { getErrorMessage } from '../../utils/error'

interface Props {
  open: boolean
  team?: Team | null
  onClose: () => void
  onSaved: () => void
}

export default function TeamFormDialog({ open, team, onClose, onSaved }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(team?.name ?? '')
      setDescription(team?.description ?? '')
      setError(null)
    }
  }, [open, team])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      const payload = { name: name.trim(), description: description.trim() || null }
      if (team) {
        await updateTeam(team.id, payload)
      } else {
        await createTeam(payload)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível salvar o team.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{team ? 'Editar team' : 'Novo team'}</DialogTitle>
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
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}