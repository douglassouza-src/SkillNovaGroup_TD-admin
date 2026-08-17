import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export interface NavItem {
  label: string
  to: string
  icon: ReactNode
}

interface Props {
  items: NavItem[]
  onNavigate?: () => void
}

export default function SidebarNav({ items, onNavigate }: Props) {
  const { pathname } = useLocation()

  return (
    <List sx={{ px: 1, py: 2 }}>
      {items.map((item) => {
        const selected =
          item.to === '/'
            ? pathname === '/'
            : pathname === item.to || pathname.startsWith(`${item.to}/`)

        return (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={selected}
            onClick={onNavigate}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'common.white',
                '& .MuiListItemIcon-root': { color: 'common.white' },
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
          </ListItemButton>
        )
      })}
    </List>
  )
}