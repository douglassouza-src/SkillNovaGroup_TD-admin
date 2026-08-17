import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string
  description?: string
  progress?: number
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  icon?: ReactNode
}

export default function KpiCard({
  label,
  value,
  description,
  progress,
  color = 'primary',
  icon,
}: Props) {
  return (
    <Card sx={{ height: '100%', borderTop: 3, borderTopColor: `${color}.main` }}>
      <CardContent sx={{ py: 3 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary" letterSpacing={1}>
              {label}
            </Typography>
            <Stack sx={{ color: `${color}.main` }}>{icon}</Stack>
          </Stack>

          <Typography variant="h3" fontWeight={600} color={`${color}.main`} lineHeight={1}>
            {value}
          </Typography>

          {typeof progress === 'number' && (
            <LinearProgress
              variant="determinate"
              value={Math.min(Math.max(progress, 0), 100)}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
          )}

          {description && (
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}