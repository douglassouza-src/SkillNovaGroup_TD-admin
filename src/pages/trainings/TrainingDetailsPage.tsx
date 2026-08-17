import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import AssociateTeamDialog from '../../components/trainings/AssociateTeamDialog'
import { listTrainings, listTrainingSessions } from '../../services/training.service'
import type { Training, TrainingSession } from '../../types'
import { formatDateTime } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'
import { trainingTypeLabels } from '../../utils/labels'

export default function TrainingDetailsPage() {
  const { trainingId } = useParams<{ trainingId: string }>()
  const navigate = useNavigate()
  const [training, setTraining] = useState<Training | null>(null)
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAssociateOpen, setIsAssociateOpen] = useState(false)

  const load = useCallback(() => {
    if (!trainingId) return
    setIsLoading(true)
    Promise.all([listTrainings(), listTrainingSessions(trainingId)])
      .then(([trainingList, sessionList]) => {
        setTraining(trainingList.find((item) => item.id === trainingId) ?? null)
        setSessions(sessionList)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [trainingId])

  useEffect(() => {
    load()
  }, [load])

  return (
    <>
      <PageHeader
        title={training?.name ?? 'Treinamento'}
        subtitle={training?.description ?? undefined}
        action={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/trainings')}>
              Voltar
            </Button>
            <Button
              variant="outlined"
              startIcon={<GroupAddIcon />}
              onClick={() => setIsAssociateOpen(true)}
            >
              Associar team
            </Button>
          </Stack>
        }
      />

      <StateHandler isLoading={isLoading} error={error}>
        <Stack spacing={3}>
          {training && (
            <Card>
              <CardContent>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Chip
                    size="small"
                    label={trainingTypeLabels[training.type]}
                    color={training.type === 'MANDATORY' ? 'primary' : 'default'}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={training.isActive ? 'Ativo' : 'Inativo'}
                    color={training.isActive ? 'success' : 'default'}
                  />
                </Stack>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Sessões
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {sessions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  Nenhuma sessão cadastrada para este treinamento.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Início</TableCell>
                        <TableCell>Término</TableCell>
                        <TableCell>Local</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id} hover>
                          <TableCell>{formatDateTime(session.startAt)}</TableCell>
                          <TableCell>{formatDateTime(session.endAt)}</TableCell>
                          <TableCell>{session.location ?? '—'}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              variant="outlined"
                              label={session.isCancelled ? 'Cancelada' : 'Agendada'}
                              color={session.isCancelled ? 'error' : 'success'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Stack>
      </StateHandler>

      {trainingId && (
        <AssociateTeamDialog
          open={isAssociateOpen}
          trainingId={trainingId}
          onClose={() => setIsAssociateOpen(false)}
          onSaved={load}
        />
      )}
    </>
  )
}