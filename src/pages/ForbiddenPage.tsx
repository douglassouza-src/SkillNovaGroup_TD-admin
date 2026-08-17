import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function ForbiddenPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5">Acesso negado</Typography>
        <Typography variant="body2" color="text.secondary">
          Você não tem permissão para acessar esta área.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Voltar ao início
        </Button>
      </Stack>
    </Box>
  )
}