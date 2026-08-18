import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Stack spacing={2} sx={{alignItems: "center"}}>
        <Typography variant="h4">404</Typography>
        <Typography variant="body2" color="text.secondary">
          A página que você procura não existe.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Voltar ao início
        </Button>
      </Stack>
    </Box>
  )
}