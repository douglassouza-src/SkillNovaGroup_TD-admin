import VisibilityIcon from '@mui/icons-material/Visibility'
import {
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
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import StateHandler from '../../components/StateHandler'
import { listTeams } from '../../services/team.service'
import type { Team } from '../../types'
import { getErrorMessage } from '../../utils/error'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { Button } from '@mui/material'
import { useCallback } from 'react'
import TeamFormDialog from '../../components/teams/TeamFormDialog'

export default function TeamsPage() {
    const navigate = useNavigate()
    const [teams, setTeams] = useState<Team[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Team | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const load = useCallback(() => {
        setIsLoading(true)
        listTeams()
            .then(setTeams)
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        load()
    }, [load])

    return (
        <>
            <PageHeader
                title="Teams"
                subtitle="Equipes de técnicos cadastradas."
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditing(null)
                            setIsFormOpen(true)
                        }}
                    >
                        Novo team
                    </Button>
                }
            />
            <StateHandler
                isLoading={isLoading}
                error={error}
                isEmpty={teams.length === 0}
                emptyMessage="Nenhum team cadastrado."
            >
                <Card>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Gestor</TableCell>
                                    <TableCell>Coordenador</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {teams.map((team) => (
                                    <TableRow key={team.id} hover>
                                        <TableCell>{team.name}</TableCell>
                                        <TableCell>{team.manager?.name ?? '—'}</TableCell>
                                        <TableCell>{team.coordinator?.name ?? '—'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={team.isActive ? 'Ativo' : 'Inativo'}
                                                color={team.isActive ? 'success' : 'default'}
                                                variant="outlined"
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip title="Ver detalhes">
                                                <IconButton size="small" onClick={() => navigate(`/teams/${team.id}`)}>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setEditing(team)
                                                                setIsFormOpen(true)
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
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
            <TeamFormDialog
                open={isFormOpen}
                team={editing}
                onClose={() => setIsFormOpen(false)}
                onSaved={load}
            />
        </>
    )
}