import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import { getTeam } from '../../services/team.service'
import type { Team } from '../../types'
import { formatDate } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'

import { useCallback } from 'react'
import AssignUserDialog from '../../components/teams/AssignUserDialog'
import { assignCoordinator, assignManager, getTeam } from '../../services/team.service'

export default function TeamDetailsPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

 const [dialog, setDialog] = useState<'manager' | 'coordinator' | null>(null)

const load = useCallback(() => {
  if (!teamId) return
  setIsLoading(true)
  getTeam(teamId)
    .then(setTeam)
    .catch((err) => setError(getErrorMessage(err)))
    .finally(() => setIsLoading(false))
}, [teamId])

useEffect(() => {
  load()
}, [load])

  return (
    <>
      <PageHeader
        title={team?.name ?? 'Team'}
        subtitle={team?.description ?? undefined}
        action={
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/teams')}>
            Voltar
          </Button>
        }
      />

      <StateHandler isLoading={isLoading} error={error}>
        {team && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Field label="Gestor" value={team.manager?.name ?? '—'} />
                <Divider />
                <Field label="Coordenador" value={team.coordinator?.name ?? '—'} />
                <Divider />
                <Field label="Criado em" value={formatDate(team.createdAt)} />
                <Divider />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
                    Status
                  </Typography>
                  <Chip
                    size="small"
                    label={team.isActive ? 'Ativo' : 'Inativo'}
                    color={team.isActive ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Stack>
                <Divider />
<Stack direction="row" spacing={1}>
  <Button size="small" variant="outlined" onClick={() => setDialog('manager')}>
    Alterar gestor
  </Button>
  <Button size="small" variant="outlined" onClick={() => setDialog('coordinator')}>
    Alterar coordenador
  </Button>
</Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </StateHandler>
      <AssignUserDialog
  open={dialog === 'manager'}
  title="Alterar gestor"
  roles={['MANAGER', 'MASTER']}
  currentUserId={team?.manager?.id}
  onClose={() => setDialog(null)}
  onConfirm={async (userId) => {
    await assignManager(team!.id, userId)
    load()
  }}
/>
<AssignUserDialog
  open={dialog === 'coordinator'}
  title="Alterar coordenador"
  roles={['COORDINATOR']}
  currentUserId={team?.coordinator?.id}
  onClose={() => setDialog(null)}
  onConfirm={async (userId) => {
    await assignCoordinator(team!.id, userId)
    load()
  }}
/>
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  )
}