import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import {
  Button,
  Card,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import CancelSessionDialog from '../../components/sessions/CancelSessionDialog'
import RescheduleSessionDialog from '../../components/sessions/RescheduleSessionDialog'
import SessionFormDialog from '../../components/sessions/SessionFormDialog'
import { listAllSessions, type SessionWithTraining } from '../../services/training.service'
import { formatDateTime } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'
import PeopleIcon from '@mui/icons-material/People'
import { useNavigate } from 'react-router-dom'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithTraining[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [toReschedule, setToReschedule] = useState<SessionWithTraining | null>(null)
  const [toCancel, setToCancel] = useState<SessionWithTraining | null>(null)

  const navigate = useNavigate()

  const load = useCallback(() => {
    setIsLoading(true)
    listAllSessions()
      .then(setSessions)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const trainingOptions = useMemo(() => {
    const map = new Map<string, string>()
    sessions.forEach((session) => map.set(session.trainingId, session.trainingName))
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [sessions])

  const visible = useMemo(
    () => (filter === 'ALL' ? sessions : sessions.filter((s) => s.trainingId === filter)),
    [sessions, filter],
  )

  return (
    <>
      <PageHeader
        title="Sessões"
        subtitle="Realizações agendadas dos treinamentos."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsFormOpen(true)}>
            Nova sessão
          </Button>
        }
      />

      <Stack direction="row" spacing={2} sx={{ mb: 2, maxWidth: 320 }}>
        <TextField
          select
          label="Treinamento"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <MenuItem value="ALL">Todos</MenuItem>
          {trainingOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <StateHandler
        isLoading={isLoading}
        error={error}
        isEmpty={visible.length === 0}
        emptyMessage="Nenhuma sessão cadastrada."
      >
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Treinamento</TableCell>
                  <TableCell>Início</TableCell>
                  <TableCell>Término</TableCell>
                  <TableCell>Local</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((session) => {
                  const isPast = new Date(session.startAt).getTime() <= Date.now()
                  return (
                    <TableRow key={session.id} hover>
                      <TableCell>{session.trainingName}</TableCell>
                      <TableCell>{formatDateTime(session.startAt)}</TableCell>
                      <TableCell>{formatDateTime(session.endAt)}</TableCell>
                      <TableCell>{session.location ?? '—'}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          color={session.isCancelled ? 'error' : isPast ? 'default' : 'success'}
                          label={session.isCancelled ? 'Cancelada' : isPast ? 'Realizada' : 'Agendada'}
                        />
                      </TableCell>
                      <Tooltip title="Participantes">
  <IconButton
    size="small"
    onClick={() => navigate(`/sessions/${session.id}/participants`)}
  >
    <PeopleIcon fontSize="small" />
  </IconButton>
</Tooltip>
                      <TableCell align="right">
                        <Tooltip title="Reagendar">
                          <span>
                            <IconButton
                              size="small"
                              disabled={session.isCancelled}
                              onClick={() => setToReschedule(session)}
                            >
                              <EventRepeatIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Cancelar">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={session.isCancelled || isPast}
                              onClick={() => setToCancel(session)}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </StateHandler>

      <SessionFormDialog open={isFormOpen} onClose={() => setIsFormOpen(false)} onSaved={load} />
      <RescheduleSessionDialog
        open={Boolean(toReschedule)}
        session={toReschedule}
        onClose={() => setToReschedule(null)}
        onSaved={load}
      />
      <CancelSessionDialog
        open={Boolean(toCancel)}
        session={toCancel}
        onClose={() => setToCancel(null)}
        onSaved={load}
      />
    </>
  )
}