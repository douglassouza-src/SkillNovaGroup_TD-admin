import {
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import { listMyHistory } from '../../services/training.service'
import type { TechnicianHistoryItem } from '../../types'
import { formatDate, formatTime } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'
import {
  evaluationColors,
  evaluationLabels,
  participationLabels,
  trainingTypeLabels,
} from '../../utils/labels'

export default function MyHistoryPage() {
  const [items, setItems] = useState<TechnicianHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    listMyHistory()
      .then((data) => active && setItems(data))
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setIsLoading(false))
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <PageHeader title="Histórico" subtitle="Treinamentos que você já realizou." />

      <StateHandler
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        emptyMessage="Nenhum treinamento realizado ainda."
      >
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Treinamento</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Local</TableCell>
                  <TableCell>Participação</TableCell>
                  <TableCell>Avaliação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.sessionId} hover>
                    <TableCell>{item.trainingName}</TableCell>
                    <TableCell>{trainingTypeLabels[item.trainingType]}</TableCell>
                    <TableCell>{formatDate(item.startAt)}</TableCell>
                    <TableCell>
                      {formatTime(item.startAt)} — {formatTime(item.endAt)}
                    </TableCell>
                    <TableCell>{item.location ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={participationLabels[item.participationStatus]}
                        color={item.participationStatus === 'PARTICIPATED' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {item.evaluation ? (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={evaluationLabels[item.evaluation]}
                          color={evaluationColors[item.evaluation]}
                        />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </StateHandler>
    </>
  )
}