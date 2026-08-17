import { Box, Card, CardContent, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import type { ManagerDashboardEvaluations } from '../../types'

interface Props {
  evaluations: ManagerDashboardEvaluations
}

const rows = [
  { key: 'veryGood', label: 'Muito bom', color: 'success' },
  { key: 'good', label: 'Bom', color: 'info' },
  { key: 'poor', label: 'Ruim', color: 'error' },
] as const

export default function EvaluationDistribution({ evaluations }: Props) {
  const total = evaluations.total

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1">Distribuição das avaliações</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {total} avaliação(ões) registrada(s)
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {total === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Nenhuma avaliação registrada até o momento.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {rows.map((row) => {
              const value = evaluations[row.key]
              const percent = (value / total) * 100
              return (
                <Box key={row.key}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">{row.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value} ({Math.round(percent)}%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    color={row.color}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}