import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import AddParticipantDialog from '../../components/sessions/AddParticipantDialog'
import {
  listAllSessions,
  listSessionParticipants,
  recordAttendance,
  recordEvaluation,
  type SessionWithTraining,
} from '../../services/training.service'
import { EVALUATIONS, PARTICIPATION_STATUS } from '../../types'
import type { Evaluation, ParticipationStatus, SessionParticipant } from '../../types'
import { formatDateTime } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'
import { evaluationLabels, participationLabels } from '../../utils/labels'

export default function SessionParticipantsPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const [session, setSession] = useState<SessionWithTraining | null>(null)
  const [participants, setParticipants] = useState<SessionParticipant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const load = useCallback(() => {
    if (!sessionId) return
    setIsLoading(true)
    Promise.all([listAllSessions(), listSessionParticipants(sessionId)])
      .then(([sessions, list]) => {
        setSession(sessions.find((item) => item.id === sessionId) ?? null)
        setParticipants(list)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [sessionId])

  useEffect(() => {
    load()
  }, [load])

  const hasEnded = session ? new Date(session.endAt).getTime() <= Date.now() : false
  const canEvaluate = Boolean(session && hasEnded && !session.isCancelled)
  const existingUserIds = useMemo(
    () => participants.map((participant) => participant.userId),
    [participants],
  )

  async function handleAttendance(participant: SessionParticipant, status: ParticipationStatus) {
    if (!sessionId) return
    setActionError(null)
    try {
      await recordAttendance(sessionId, participant.id, status)
      load()
    } catch (err) {
      setActionError(getErrorMessage(err, 'Não foi possível registrar a presença.'))
    }
  }

  async function handleEvaluation(participant: SessionParticipant, evaluation: Evaluation) {
    setActionError(null)
    try {
      await recordEvaluation(participant.id, evaluation)
      load()
    } catch (err) {
      setActionError(getErrorMessage(err, 'Não foi possível registrar a avaliação.'))
    }
  }

  return (
    <>
      <PageHeader
        title="Participantes da sessão"
        subtitle={
          session
            ? `${session.trainingName} • ${formatDateTime(session.startAt)}`
            : undefined
        }
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/sessions')}>
              Voltar
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              disabled={Boolean(session?.isCancelled)}
              onClick={() => setIsAddOpen(true)}
            >
              Adicionar
            </Button>
          </Stack>
        }
      />

      {session?.isCancelled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Sessão cancelada{session.cancellationReason ? `: ${session.cancellationReason}` : '.'}
        </Alert>
      )}
      {!hasEnded && !session?.isCancelled && (
        <Alert severity="info" sx={{ mb: 2 }}>
          A avaliação só fica disponível depois do término da sessão.
        </Alert>
      )}
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      <StateHandler
        isLoading={isLoading}
        error={error}
        isEmpty={participants.length === 0}
        emptyMessage="Nenhum participante nesta sessão."
      >
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Técnico</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell width={180}>Presença</TableCell>
                    <TableCell width={200}>Avaliação</TableCell>
                    <TableCell>Registros</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.map((participant) => (
                    <TableRow key={participant.id} hover>
                      <TableCell>
                        <Typography variant="body2">{participant.userName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {participant.userEmail}
                        </Typography>
                      </TableCell>
                      <TableCell>{participant.teamName ?? '—'}</TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={participant.participationStatus}
                          disabled={Boolean(session?.isCancelled)}
                          onChange={(event) =>
                            handleAttendance(participant, event.target.value as ParticipationStatus)
                          }
                        >
                          {PARTICIPATION_STATUS.map((status) => (
                            <MenuItem key={status} value={status}>
                              {participationLabels[status]}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={participant.evaluation ?? ''}
                          disabled={
                            !canEvaluate || participant.participationStatus !== 'PARTICIPATED'
                          }
                          onChange={(event) =>
                            handleEvaluation(participant, event.target.value as Evaluation)
                          }
                        >
                          <MenuItem value="" disabled>
                            Não avaliado
                          </MenuItem>
                          {EVALUATIONS.map((evaluation) => (
                            <MenuItem key={evaluation} value={evaluation}>
                              {evaluationLabels[evaluation]}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          {participant.attendanceRecordedAt && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Presença: ${formatDateTime(participant.attendanceRecordedAt)}`}
                            />
                          )}
                          {participant.evaluatedAt && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Avaliação: ${formatDateTime(participant.evaluatedAt)}`}
                            />
                          )}
                          {!participant.attendanceRecordedAt && !participant.evaluatedAt && '—'}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </StateHandler>

      {sessionId && (
        <AddParticipantDialog
          open={isAddOpen}
          sessionId={sessionId}
          existingUserIds={existingUserIds}
          onClose={() => setIsAddOpen(false)}
          onSaved={load}
        />
      )}
    </>
  )
}