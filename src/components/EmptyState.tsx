import InboxIcon from '@mui/icons-material/Inbox'
import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  message: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ message, description, action }: Props) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Stack spacing={1} sx={{
        alignItems: "center",
      }}>
        <InboxIcon sx={{ fontSize: 44, color: 'text.disabled' }} />
        <Typography variant="subtitle1">{message}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {action}
      </Stack>
    </Box>
  )
}