import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { listTeams } from '../../services/team.service'
import { createUser } from '../../services/user.service'
import type { Role, Team } from '../../types'
import { getErrorMessage } from '../../utils/error'
import { roleLabels } from '../../utils/labels'

const ROLES: Role[] = ['MASTER', 'MANAGER', 'COORDINATOR', 'TECHNICIAN']

interface Props {
  open: boolean
  onClose: () => void
}

interface Feedback {
  severity: 'success' | 'error'
  message: string
}

interface FormValues {
  name: string
  email: string
  password: string
  role: Role
  teamId: string
}

const EMPTY_FORM: FormValues = {
  name: '',
  email: '',
  password: '',
  role: 'MASTER',
  teamId: '',
}

function requiresTeam(role: Role): boolean {
  return role === 'COORDINATOR' || role === 'TECHNICIAN'
}

export default function UserFormDialog({ open, onClose }: Props) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [teams, setTeams] = useState<Team[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  function resetState() {
    setValues(EMPTY_FORM)
    setTeams([])
    setError(null)
    setFieldErrors({})
    setFeedback(null)
    setIsSubmitting(false)
    setIsLoadingTeams(false)
  }

  useEffect(() => {
    if (!open) return
    resetState()
  }, [open])

  useEffect(() => {
    if (!open || !requiresTeam(values.role)) {
      if (!requiresTeam(values.role)) {
        setValues((current) => ({ ...current, teamId: '' }))
      }
      return
    }

    let isMounted = true
    setIsLoadingTeams(true)
    setError(null)

    listTeams()
      .then((items) => {
        if (!isMounted) return
        setTeams(items.filter((team) => team.isActive))
      })
      .catch((err) => {
        if (!isMounted) return
        setError(getErrorMessage(err, 'Não foi possível carregar as equipes.'))
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingTeams(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [open, values.role])

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
    if (error) setError(null)
  }

  function validate(): Partial<Record<keyof FormValues, string>> {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {}

    const name = values.name.trim()
    if (!name) {
      nextErrors.name = 'Nome é obrigatório.'
    } else if (name.length > 150) {
      nextErrors.name = 'Nome deve ter no máximo 150 caracteres.'
    }

    const email = values.email.trim()
    if (!email) {
      nextErrors.email = 'E-mail é obrigatório.'
    } else if (email.length > 255) {
      nextErrors.email = 'E-mail deve ter no máximo 255 caracteres.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    const password = values.password
    if (!password) {
      nextErrors.password = 'Senha é obrigatória.'
    } else if (password.length < 8) {
      nextErrors.password = 'Senha deve ter no mínimo 8 caracteres.'
    } else if (password.length > 255) {
      nextErrors.password = 'Senha deve ter no máximo 255 caracteres.'
    }

    if (!ROLES.includes(values.role)) {
      nextErrors.role = 'Selecione um perfil válido.'
    }

    if (requiresTeam(values.role) && !values.teamId) {
      nextErrors.teamId = 'Selecione uma equipe.'
    }

    if (!requiresTeam(values.role) && values.teamId) {
      nextErrors.teamId = undefined
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFeedback(null)
    setError(null)

    const validationErrors = validate()
    setFieldErrors(validationErrors)
    const hasErrors = Object.keys(validationErrors).length > 0
    if (hasErrors) {
      setError('Verifique os campos do formulário.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
        teamId: requiresTeam(values.role) ? values.teamId : null,
      }

      await createUser(payload)
      setFeedback({ severity: 'success', message: 'Usuário criado com sucesso.' })
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar o usuário.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasTeamField = requiresTeam(values.role)

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Novo usuário</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Nome"
                value={values.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
                autoFocus
                slotProps={{
                  htmlInput: {
                    maxLength: 100,
                  },
                }}
                error={Boolean(fieldErrors.name)}
                helperText={fieldErrors.name}
              />

              <TextField
                label="E-mail"
                type="email"
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
                slotProps={{
                  htmlInput: {
                    maxLength: 100,
                  },
                }}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
              />

              <TextField
                label="Senha"
                type="password"
                value={values.password}
                onChange={(event) => updateField('password', event.target.value)}
                required
                slotProps={{
                  htmlInput: {
                    maxLength: 100,
                  },
                }}
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password}
              />

              <TextField
                select
                label="Perfil"
                value={values.role}
                onChange={(event) => {
                  const nextRole = event.target.value as Role
                  setValues((current) => ({
                    ...current,
                    role: nextRole,
                    teamId: requiresTeam(nextRole) ? current.teamId : '',
                  }))
                  setFieldErrors((current) => {
                    const next = { ...current }
                    delete next.role
                    return next
                  })
                  if (error) setError(null)
                }}
                required
                error={Boolean(fieldErrors.role)}
                helperText={fieldErrors.role}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {roleLabels[role]}
                  </MenuItem>
                ))}
              </TextField>

              {hasTeamField && (
                <TextField
                  select
                  label="Equipe"
                  value={values.teamId}
                  onChange={(event) => updateField('teamId', event.target.value)}
                  required
                  disabled={isLoadingTeams}
                  error={Boolean(fieldErrors.teamId)}
                  helperText={fieldErrors.teamId}
                >
                  <MenuItem value="" disabled>
                    {isLoadingTeams ? 'Carregando equipes...' : 'Selecione uma equipe'}
                  </MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting || isLoadingTeams}>
              {isSubmitting ? 'Criando...' : 'Criar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={5000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)} variant="filled">
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  )
}
