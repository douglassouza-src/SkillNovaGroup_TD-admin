import MenuIcon from '@mui/icons-material/Menu'
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import UserMenu from '../components/UserMenu'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import SidebarNav from '../components/SidebarNav'
import { getNavItems } from '../routes/navigation'
import { roleLabels } from '../utils/labels'

const DRAWER_WIDTH = 260


export default function AdminLayout() {


    const [mobileOpen, setMobileOpen] = useState(false)

    const { user, signOut } = useAuth()
    const items = getNavItems(user?.role)
    const navigate = useNavigate()

    function handleLogout() {
        signOut()
        navigate('/login', { replace: true })
    }

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ px: 2 }}>
                <Typography variant="h6" color="primary" noWrap>
                    SkillNova TD
                </Typography>
            </Toolbar>
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <SidebarNav items={items} onNavigate={() => setMobileOpen(false)} />
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
  <Typography variant="caption" color="text.secondary">
    {user?.name}
  </Typography>
  <Typography variant="caption" color="text.secondary" display="block">
    {user ? roleLabels[user.role] : ''}
  </Typography>
</Box>
        </Box>
    )

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <Toolbar sx={{ gap: 2 }}>
                    <IconButton
                        edge="start"
                        onClick={() => setMobileOpen(true)}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flex: 1 }} />
                    <UserMenu
                        name={user?.name || user?.email || 'Usuário'}
                        role={user?.role ?? ''}
                        onLogout={handleLogout}
                    />        </Toolbar>
            </AppBar>

            <Box component="nav" sx={{
  flexGrow: 1,
  width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
  p: { xs: 2, md: 3 },
}}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    p: { xs: 2, md: 3 },
                }}
            >
                <Toolbar />
<Box sx={{ maxWidth: 1200, mx: 'auto' }}>
  <Outlet />
</Box>            </Box>
        </Box>
    )
}