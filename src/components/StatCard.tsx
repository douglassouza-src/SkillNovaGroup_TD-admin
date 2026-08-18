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
            <Stack alignItems="center" justifyContent="center">
              {icon}
            </Stack>
          )}
          <Stack>
            <Typography variant="h5">{value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}