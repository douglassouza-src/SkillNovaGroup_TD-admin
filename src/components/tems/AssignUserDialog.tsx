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
import { listUsers, type UserOption } from '../../services/user.service'
import type { Role } from '../../types'
import { getErrorMessage } from '../../utils/error'

interface Props {
  open: boolean
  title: string
  roles: Role[]
  currentUserId?: string | null
  onClose: () => void
  onConfirm: (userId: string) => Promise<void>
}

export default function AssignUserDialog({
  open,
  title,
  roles,
  currentUserId,
  onClose,
  onConfirm,
}: Props) {
  const [users, setUsers] = useState<UserOption[]>([])
  const [selected, setSelected] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelected(currentUserId ?? '')
    setError(null)
    listUsers()
      .then((list) => setUsers(list.filter((user) => user.isActive && roles.includes(user.role))))
      .catch((err) => setError(getErrorMessage(err)))
  }, [open, currentUserId, roles])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      await onConfirm(selected)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível salvar.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              select
              label="Usuário"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
              required
            >
              {users.length === 0 && (
                <MenuItem value="" disabled>
                  Nenhum usuário disponível
                </MenuItem>
              )}
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} — {user.email}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSaving || !selected}>
            {isSaving ? 'Salvando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}