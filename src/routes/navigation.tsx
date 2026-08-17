import AssignmentIcon from '@mui/icons-material/Assignment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupsIcon from '@mui/icons-material/Groups'
import HistoryIcon from '@mui/icons-material/History'
import SchoolIcon from '@mui/icons-material/School'
import type { NavItem } from '../components/SidebarNav'
import type { Role } from '../types'

interface NavDefinition extends NavItem {
  roles: Role[]
}

const ADMIN: Role[] = ['MASTER', 'MANAGER', 'COORDINATOR']

const navigation: NavDefinition[] = [
  {
    label: 'Dashboard',
    to: '/',
    icon: <DashboardIcon fontSize="small" />,
    roles: ['MASTER', 'MANAGER', 'COORDINATOR', 'TECHNICIAN'],
  },
  { label: 'Teams', to: '/teams', icon: <GroupsIcon fontSize="small" />, roles: ADMIN },
  { label: 'Treinamentos', to: '/trainings', icon: <SchoolIcon fontSize="small" />, roles: ADMIN },
  { label: 'Sessões', to: '/sessions', icon: <EventNoteIcon fontSize="small" />, roles: ADMIN },
  {
    label: 'Meus treinamentos',
    to: '/me/todo',
    icon: <AssignmentIcon fontSize="small" />,
    roles: ['TECHNICIAN'],
  },
  {
    label: 'Histórico',
    to: '/me/history',
    icon: <HistoryIcon fontSize="small" />,
    roles: ['TECHNICIAN'],
  },
]

export function getNavItems(role: Role | undefined): NavItem[] {
  if (!role) return []
  return navigation
    .filter((item) => item.roles.includes(role))
    .map(({ label, to, icon }) => ({ label, to, icon }))
}