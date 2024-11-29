
import React from 'react'

import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'


import MenuIcon from '@mui/icons-material/Menu'
import SettingsIcon from '@mui/icons-material/Settings'
import SyncIcon from '@mui/icons-material/Sync';
import SideDrawer from '../Molecules/SideMenuDrawer';

import { Link, useLocation } from 'react-router-dom'
import SettingsDialog from '../Molecules/SettingsDialog';
import SyncDialog from '../Molecules/SyncDialog';
import SwitchButton from '../Atoms/SwtichButton';
import { useAuth } from '../../context/AuthContext';


function TopMenuNavigation({onModeChange}) {

    const { auth, logout } = useAuth();

    const [open, setOpen] = React.useState(false)
    const [settingsOpen, setSettingsOpen] = React.useState(false)
    const [syncOpen, setSyncOpen] = React.useState(false)
    const location = useLocation()

    React.useEffect(() => {
        setOpen(false)
    }, [location])

    return (
        <>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon fontSize="large" />
                    </IconButton>
                    <Link to="/" style={{color: "inherit", textDecoration: "none" }}>
                        <Typography variant="h6">
                            TAES  - ({auth.username})
                        </Typography>
                    </Link>
                    <Box sx={{flexGrow: 1}} />
                    <Tooltip
                        title="Theme"
                    >
                        <IconButton
                        >
                           <SwitchButton onModeChange={onModeChange} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title="Print"
                    >
                       <IconButton
                            onClick={() => logout()}
                        >Logout</IconButton>
                    </Tooltip>
                    <Tooltip
                        title="Sync"
                    >
                        <IconButton
                            onClick={() => setSyncOpen(true)}
                        >
                            <SyncIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title="Settings"
                    >
                        <IconButton
                            onClick={() => setSettingsOpen(true)}
                        >
                            <SettingsIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </Box>
        <SideDrawer
            open={open}
            close={() => setOpen(false)}
        />
        <SettingsDialog
            open={settingsOpen}
            close={() => setSettingsOpen(false)}
        />
        <SyncDialog
            open={syncOpen}
            close={() => setSyncOpen(false)}
        />
        </>
    )
}

export default TopMenuNavigation