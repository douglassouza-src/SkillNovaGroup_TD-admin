import {
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import type { ManagerDashboardTeam } from '../../types'
import { formatAverage, formatPercent } from '../../utils/number'

interface Props {
  teams: ManagerDashboardTeam[]
}

export default function TeamComparisonTable({ teams }: Props) {
  const [filter, setFilter] = useState('ALL')

  const visible = useMemo(
    () => (filter === 'ALL' ? teams : teams.filter((team) => team.teamId === filter)),
    [teams, filter],
  )

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 1,
          }}
        >
          <Typography variant="subtitle1">Desempenho por equipe</Typography>
          <TextField
            select
            label="Equipe"
            size="small"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="ALL">Todas</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.teamId} value={team.teamId}>
                {team.teamName}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Divider />

        {visible.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            Nenhuma equipe com dados consolidados.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Equipe</TableCell>
                  <TableCell align="right">Técnicos</TableCell>
                  <TableCell align="right">Participantes</TableCell>
                  <TableCell align="right">Participação</TableCell>
                  <TableCell align="right">Ausência</TableCell>
                  <TableCell align="right">Avaliação média</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((team) => (
                  <TableRow key={team.teamId} hover>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell align="right">{team.technicians}</TableCell>
                    <TableCell align="right">{team.participants}</TableCell>
                    <TableCell align="right">{formatPercent(team.participationRate)}</TableCell>
                    <TableCell align="right">{formatPercent(team.absenceRate)}</TableCell>
                    <TableCell align="right">{formatAverage(team.averageEvaluation)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}