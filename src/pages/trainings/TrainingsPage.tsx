import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Button,
  Card,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import TrainingFormDialog from '../../components/trainings/TrainingFormDialog'
import { listTrainings } from '../../services/training.service'
import type { Training } from '../../types'
import { formatDate } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'
import { trainingTypeLabels } from '../../utils/labels'

export default function TrainingsPage() {
  const navigate = useNavigate()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const load = useCallback(() => {
    setIsLoading(true)
    listTrainings()
      .then(setTrainings)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <>
      <PageHeader
        title="Treinamentos"
        subtitle="Treinamentos técnicos cadastrados."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsFormOpen(true)}>
            Novo treinamento
          </Button>
        }
      />

      <StateHandler
        isLoading={isLoading}
        error={error}
        isEmpty={trainings.length === 0}
        emptyMessage="Nenhum treinamento cadastrado."
      >
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Criado em</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainings.map((training) => (
                  <TableRow key={training.id} hover>
                    <TableCell>{training.name}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={trainingTypeLabels[training.type]}
                        color={training.type === 'MANDATORY' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(training.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver detalhes">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/trainings/${training.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </StateHandler>

      <TrainingFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={load}
      />
    </>
  )
}