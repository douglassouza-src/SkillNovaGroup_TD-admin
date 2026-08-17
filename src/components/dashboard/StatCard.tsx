import { Card, CardContent, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  label: string
  value: number | string
  subtitle?: string
  icon?: ReactNode
}

export default function StatCard({ label, value, subtitle, icon }: Props) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          {icon && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'action.hover',
                color: 'primary.main',
                flexShrink: 0,
              }}
            >
              {icon}
            </Stack>
          )}
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="h5">{value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled">
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}