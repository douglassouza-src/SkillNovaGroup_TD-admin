import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import EngineeringIcon from '@mui/icons-material/Engineering'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import GroupsIcon from '@mui/icons-material/Groups'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import SchoolIcon from '@mui/icons-material/School'
import StarRateIcon from '@mui/icons-material/StarRate'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Alert, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import EvaluationDistribution from '../components/dashboard/EvaluationDistribution'
import KpiCard from '../components/dashboard/KpiCard'
import TeamComparisonTable from '../components/dashboard/TeamComparisonTable'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getManagerDashboard } from '../services/dashboard.service'
import type { ManagerDashboard as ManagerDashboardData } from '../types'
import { getErrorMessage } from '../utils/error'
import { formatAverage, formatPercent } from '../utils/number'

const MAX_EVALUATION = 3

export default function DashboardPage() {
  const { user } = useAuth()
  useDocumentTitle('Dashboard')

  if (user?.role === 'TECHNICIAN') {
    return <Navigate to="/me/todo" replace />
  }

  if (user?.role === 'COORDINATOR') {
    return <Navigate to="/trainings" replace />
  }

  return (
    <>
      <PageHeader
        title={`Olá, ${user?.name || 'usuário'}`}
        subtitle="Indicadores consolidados da operação de treinamentos."
      />
      <ManagerDashboard />
    </>
  )
}

function ManagerDashboard() {
  const [data, setData] = useState<ManagerDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getManagerDashboard()
      .then((dashboard) => active && setData(dashboard))
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setIsLoading(false))

    return () => {
      active = false
    }
  }, [])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!data) {
    return <Alert severity="info">Nenhum dado consolidado disponível.</Alert>
  }

  const { summary, evaluations, byTeam } = data
  const optionalTrainings = summary.totalTrainings - summary.mandatoryTrainings

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Section
        title="Visão executiva"
        description="Estrutura atual da operação de treinamentos."
      >
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Equipes"
              value={summary.teams}
              icon={<GroupsIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Técnicos"
              value={summary.technicians}
              icon={<EngineeringIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Treinamentos"
              value={summary.totalTrainings}
              subtitle={`${summary.mandatoryTrainings} obrigatório(s) • ${optionalTrainings} opcional(is)`}
              icon={<SchoolIcon />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Sessões concluídas"
              value={summary.completedSessions}
              icon={<EventAvailableIcon />}
            />
          </Grid>
        </Grid>
      </Section>

      <Section
        title="Indicadores de desempenho"
        description="Base para decisões sobre engajamento e qualidade dos treinamentos."
      >
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              label="Participação"
              value={formatPercent(summary.participationRate)}
              progress={summary.participationRate}
              color="success"
              icon={<TrendingUpIcon />}
              description="Presenças confirmadas sobre o total de participantes."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              label="Ausência"
              value={formatPercent(summary.absenceRate)}
              progress={summary.absenceRate}
              color={summary.absenceRate > 20 ? 'error' : 'warning'}
              icon={<PersonOffIcon />}
              description="Faltas registradas sobre o total de participantes."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <KpiCard
              label="Avaliação média"
              value={`${formatAverage(summary.averageEvaluation)} / 3,00`}
              progress={(summary.averageEvaluation / MAX_EVALUATION) * 100}
              color="info"
              icon={<StarRateIcon />}
              description={`Escala de 0 a ${MAX_EVALUATION} • ${evaluations.total} avaliação(ões)`}
            />
          </Grid>
        </Grid>
      </Section>

      <Section
        title="Qualidade e comparação"
        description="Distribuição das notas e desempenho individual das equipes."
      >
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <EvaluationDistribution evaluations={evaluations} />
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <TeamComparisonTable teams={byTeam} />
          </Grid>
        </Grid>
      </Section>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          minWidth: 0,
        }}
      >
        <AssignmentTurnedInIcon fontSize="small" color="disabled" />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            minWidth: 0,
          }}
        >
          {summary.mandatoryTrainings} treinamento(s) obrigatório(s) monitorado(s) nesta operação.
        </Typography>
      </Stack>
    </Stack>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Stack spacing={{ xs: 1.25, md: 1.5 }}>
      <Stack>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>

      {children}
    </Stack>
  )
}