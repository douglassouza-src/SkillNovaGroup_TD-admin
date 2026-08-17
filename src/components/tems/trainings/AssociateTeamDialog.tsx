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
import type { Team } from '../../../types'
import { listTeams } from '../../../services/team.service'
import { getErrorMessage } from '../../../utils/error'
import { associateTeam } from '../../../services/training.service'


interface Props {
  open: boolean
  trainingId: string
  onClose: () => void
  onSaved: () => void
}

export default function AssociateTeamDialog({ open, trainingId, onClose, onSaved }: Props) {
  const [teams, setTeams] = useState<Team[]>([])
  const [teamId, setTeamId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setTeamId('')
    setError(null)
    listTeams()
      .then((list) => setTeams(list.filter((team) => team.isActive)))
      .catch((err) => setError(getErrorMessage(err)))
  }, [open])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      await associateTeam(trainingId, teamId)
      onSaved()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível associar o team.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Associar team</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              select
              label="Team"
              value={teamId}
              onChange={(event) => setTeamId(event.target.value)}
              required
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSaving || !teamId}>
            {isSaving ? 'Salvando...' : 'Associar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}