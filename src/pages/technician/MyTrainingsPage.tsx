import EventIcon from '@mui/icons-material/Event'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PlaceIcon from '@mui/icons-material/Place'
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import { sendTrainingAlert } from '../../services/notification.service'
import { listMyTodo } from '../../services/training.service'
import type { TechnicianTodo } from '../../types'
import { formatDate, formatTime } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'
import { trainingTypeLabels } from '../../utils/labels'

interface Feedback {
  severity: 'success' | 'error'
  message: string
}

export default function MyTrainingsPage() {
  const [items, setItems] = useState<TechnicianTodo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const load = useCallback(() => {
    setIsLoading(true)
    listMyTodo()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSendAlert(sessionId: string) {
    setSendingId(sessionId)
    try {
      await sendTrainingAlert(sessionId)
      setFeedback({ severity: 'success', message: 'Alerta enviado para o Discord.' })
    } catch (err) {
      setFeedback({
        severity: 'error',
        message: getErrorMessage(err, 'Não foi possível enviar o alerta.'),
      })
    } finally {
      setSendingId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Meus próximos treinamentos"
        subtitle="Sessões futuras em que você está inscrito."
      />

      <StateHandler
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="Você não tem treinamentos agendados."
      >
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.session.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="subtitle1">{item.trainingName}</Typography>
                      <Chip
                        size="small"
                        label={trainingTypeLabels[item.type]}
                        color={item.type === 'MANDATORY' ? 'primary' : 'default'}
                      />
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatDate(item.session.startAt)} • {formatTime(item.session.startAt)} às{' '}
                        {formatTime(item.session.endAt)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <PlaceIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {item.session.location ?? 'Local a definir'}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<NotificationsActiveIcon />}
                    disabled={sendingId === item.session.id}
                    onClick={() => handleSendAlert(item.session.id)}
                  >
                    {sendingId === item.session.id ? 'Enviando...' : 'Enviar alerta'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </StateHandler>

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