import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
//import { Link, useLocation } from 'react-router-dom'

const TopMenuBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Name */}
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
         TAES
        </Typography>

        {/* Image */}
        <Avatar alt="Profile Image" src="/path-to-your-image.jpg" />

        {/* Menu */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          style={{ marginLeft: '10px' }}
        >
          ☰
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Home</MenuItem>
          <MenuItem onClick={handleMenuClose}>About</MenuItem>
          <MenuItem onClick={handleMenuClose}>Contact</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenuBar;
