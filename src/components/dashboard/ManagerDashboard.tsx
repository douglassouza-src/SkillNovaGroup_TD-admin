// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
// import EngineeringIcon from '@mui/icons-material/Engineering'
// import EventAvailableIcon from '@mui/icons-material/EventAvailable'
// import GroupsIcon from '@mui/icons-material/Groups'
// import PersonOffIcon from '@mui/icons-material/PersonOff'
// import SchoolIcon from '@mui/icons-material/School'
// import StarRateIcon from '@mui/icons-material/StarRate'
// import TrendingUpIcon from '@mui/icons-material/TrendingUp'
// import { Alert, Card, CardContent, Grid, Skeleton, Stack } from '@mui/material'
// import { useEffect, useState } from 'react'
// import { getManagerDashboard } from '../../services/dashboard.service'
// import type { ManagerDashboard as ManagerDashboardData } from '../../types'
// import { getErrorMessage } from '../../utils/error'
// import { formatAverage, formatPercent } from '../../utils/number'
// import StatCard from '../StatCard'
// import EvaluationDistribution from './EvaluationDistribution'
// import TeamComparisonTable from './TeamComparisonTable'

// export default function ManagerDashboard() {
//   const [data, setData] = useState<ManagerDashboardData | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     let active = true
//     getManagerDashboard()
//       .then((dashboard) => active && setData(dashboard))
//       .catch((err) => active && setError(getErrorMessage(err)))
//       .finally(() => active && setIsLoading(false))
//     return () => {
//       active = false
//     }
//   }, [])

//   if (isLoading) {
//     return <DashboardSkeleton />
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>
//   }

//   if (!data) {
//     return <Alert severity="info">Nenhum dado consolidado disponível.</Alert>
//   }

//   const { summary, evaluations, byTeam } = data

//   const cards = [
//     { label: 'Equipes', value: summary.teams, icon: <GroupsIcon /> },
//     { label: 'Técnicos', value: summary.technicians, icon: <EngineeringIcon /> },
//     { label: 'Treinamentos', value: summary.totalTrainings, icon: <SchoolIcon /> },
//     { label: 'Obrigatórios', value: summary.mandatoryTrainings, icon: <AssignmentTurnedInIcon /> },
//     { label: 'Sessões concluídas', value: summary.completedSessions, icon: <EventAvailableIcon /> },
//     { label: 'Participação', value: formatPercent(summary.participationRate), icon: <TrendingUpIcon /> },
//     { label: 'Ausência', value: formatPercent(summary.absenceRate), icon: <PersonOffIcon /> },
//     { label: 'Avaliação média', value: formatAverage(summary.averageEvaluation), icon: <StarRateIcon /> },
//   ]

//   return (
//     <Stack spacing={3}>
//       <Grid container spacing={2}>
//         {cards.map((card) => (
//           <Grid item xs={12} sm={6} md={3} key={card.label}>
//             <StatCard label={card.label} value={card.value} icon={card.icon} />
//           </Grid>
//         ))}
//       </Grid>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={5}>
//           <EvaluationDistribution evaluations={evaluations} />
//         </Grid>
//         <Grid item xs={12} md={7}>
//           <TeamComparisonTable teams={byTeam} />
//         </Grid>
//       </Grid>
//     </Stack>
//   )
// }

// function DashboardSkeleton() {
//   return (
//     <Stack spacing={3}>
//       <Grid container spacing={2}>
//         {Array.from({ length: 8 }).map((_, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Card>
//               <CardContent>
//                 <Skeleton variant="text" width="60%" height={38} />
//                 <Skeleton variant="text" width="40%" />
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={5}>
//           <Skeleton variant="rounded" height={220} />
//         </Grid>
//         <Grid item xs={12} md={7}>
//           <Skeleton variant="rounded" height={220} />
//         </Grid>
//       </Grid>
//     </Stack>
//   )
// }