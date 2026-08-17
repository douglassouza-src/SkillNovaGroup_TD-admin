import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupsIcon from '@mui/icons-material/Groups'
import SchoolIcon from '@mui/icons-material/School'
import {
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import StateHandler from '../components/StateHandler'
import { useAuth } from '../hooks/useAuth'
import { listTeams } from '../services/team.service'
import {
  listMyHistory,
  listMyTodo,
  listTrainings,
  listTrainingSessions,
} from '../services/training.service'
import type {
  TechnicianHistoryItem,
  TechnicianTodo,
  Training,
  TrainingSession,
} from '../types'
import { formatDateTime } from '../utils/date'
import { getErrorMessage } from '../utils/error'
import { evaluationColors, evaluationLabels, participationLabels, trainingTypeLabels } from '../utils/labels'

export default function DashboardPage() {
  const { user } = useAuth()
  const isTechnician = user?.role === 'TECHNICIAN'

  return (
    <>
      <PageHeader
        title={`Olá, ${user?.name || 'usuário'}`}
        subtitle="Visão geral da plataforma de treinamentos."
      />
      {isTechnician ? <TechnicianDashboard /> : <ManagerDashboard />}
    </>
  )
}

function ManagerDashboard() {
  const [teamsCount, setTeamsCount] = useState(0)
  const [trainings, setTrainings] = useState<Training[]>([])
  const [upcoming, setUpcoming] = useState<Array<TrainingSession & { trainingName: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [teams, trainingList] = await Promise.all([listTeams(), listTrainings()])
        const sessionsByTraining = await Promise.all(
          trainingList.map(async (training) => {
            const sessions = await listTrainingSessions(training.id)
            return sessions.map((session) => ({ ...session, trainingName: training.name }))
          }),
        )

        if (!active) return

        const now = Date.now()
        setTeamsCount(teams.length)
        setTrainings(trainingList)
        setUpcoming(
          sessionsByTraining
            .flat()
            .filter((session) => !session.isCancelled && new Date(session.startAt).getTime() > now)
            .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
            .slice(0, 5),
        )
      } catch (err) {
        if (active) setError(getErrorMessage(err))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <StateHandler isLoading={isLoading} error={error}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Teams" value={teamsCount} icon={<GroupsIcon />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Treinamentos ativos" value={trainings.length} icon={<SchoolIcon />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Próximas sessões" value={upcoming.length} icon={<EventNoteIcon />} />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Próximas sessões
          </Typography>
          <Divider />
          {upcoming.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              Nenhuma sessão futura agendada.
            </Typography>
          ) : (
            <List disablePadding>
              {upcoming.map((session) => (
                <ListItem key={session.id} divider disableGutters sx={{ px: 1 }}>
                  <ListItemText
                    primary={session.trainingName}
                    secondary={`${formatDateTime(session.startAt)}${session.location ? ` • ${session.location}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </StateHandler>
  )
}

function TechnicianDashboard() {
  const [todo, setTodo] = useState<TechnicianTodo[]>([])
  const [history, setHistory] = useState<TechnicianHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    Promise.all([listMyTodo(), listMyHistory()])
      .then(([todoList, historyList]) => {
        if (!active) return
        setTodo(todoList)
        setHistory(historyList)
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err))
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const next = todo[0]

  return (
    <StateHandler isLoading={isLoading} error={error}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Próximo treinamento
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {next ? (
                <Stack spacing={1}>
                  <Typography variant="h6">{next.trainingName}</Typography>
                  <Chip
                    size="small"
                    label={trainingTypeLabels[next.type]}
                    color={next.type === 'MANDATORY' ? 'primary' : 'default'}
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Typography variant="body2">{formatDateTime(next.session.startAt)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {next.session.location ?? 'Local a definir'}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum treinamento agendado.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Histórico recente
              </Typography>
              <Divider />
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                  Nenhum treinamento realizado ainda.
                </Typography>
              ) : (
                <List disablePadding>
                  {history.slice(0, 5).map((item) => (
                    <ListItem key={item.sessionId} divider disableGutters sx={{ px: 1 }}>
                      <ListItemText
                        primary={item.trainingName}
                        secondary={formatDateTime(item.startAt)}
                      />
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={participationLabels[item.participationStatus]}
                          color={item.participationStatus === 'PARTICIPATED' ? 'success' : 'default'}
                        />
                        {item.evaluation && (
                          <Chip
                            size="small"
                            variant="outlined"
                            label={evaluationLabels[item.evaluation]}
                            color={evaluationColors[item.evaluation]}
                          />
                        )}
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </StateHandler>
  )
}