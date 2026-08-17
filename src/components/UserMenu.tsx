import LogoutIcon from '@mui/icons-material/Logout'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import UserFormDialog from './tems/UserFormDialog'
import type { Role } from '../types'
import { roleLabels } from '../utils/labels'

interface Props {
  name: string
  role: Role | ''
  onLogout: () => void
}

export default function UserMenu({ name, role, onLogout }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const isMaster = role === 'MASTER'
  const displayRole = role ? roleLabels[role] : ''

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {displayRole}
          </Typography>
        </Box>
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {displayRole}
          </Typography>
        </Box>
        <Divider />
        {isMaster && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              setIsCreateUserDialogOpen(true)
            }}
          >
            <ListItemIcon>
              <PersonAddAlt1Icon fontSize="small" />
            </ListItemIcon>
            Novo usuário
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null)
            onLogout()
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>

      {isMaster && (
        <UserFormDialog
          open={isCreateUserDialogOpen}
          onClose={() => setIsCreateUserDialogOpen(false)}
        />
      )}
    </>
  )
}