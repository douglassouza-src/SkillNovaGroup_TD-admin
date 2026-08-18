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
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: 'center',
            flex: 1,
          }}
        >          {icon && (
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: 'center',
              width: 72,
              height: 72,
              borderRadius: 2,
              bgcolor: 'action.hover',
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            <Stack sx={{ fontSize: 40, display: 'flex' }}>
              {icon}
            </Stack>
          </Stack>
        )}
          <Stack
            spacing={0.5}
            sx={{
              textAlign: "center",
              alignItems: 'center',
              minWidth: 0,
            }}
          >            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled" sx={{ pt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}