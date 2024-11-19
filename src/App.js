// React
import React, { useState } from 'react'

// router
import { BrowserRouter, HashRouter } from "react-router-dom"

// MUI
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from   
 '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';   


// custom
import Nav from './nav/Nav'
import Content from './content/Content'
import { StorageContextProvider } from './context/StorageContext'
import TopMenuBar from './components/core/TopMenuBar'

function Router(props) {
  const deployment = process.env.REACT_APP_DEPLOYMENT
  /* istanbul ignore if: deployment config */
  if (deployment === "github") {
    return (
      <HashRouter>
        {props.children}
      </HashRouter>
    )
  }
  return (
    <BrowserRouter>
      {props.children}
    </BrowserRouter>
  )
}



function App() {

  const [themeMode, setThemeMode] = useState("dark");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const handleThemeMode = (value) => {
    setThemeMode(value);
  };

  let currentTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });


  if (!isAuthenticated) {
    return ( <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
          }}
        >
          <Typography variant="h5" align="center" color="primary">
            TAES Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required   

              error={!username}
              helperText={!username && 'Username is required'}
            />
            <TextField
              label="Password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!password}
              helperText={!password && 'Password is required'}
              type="password"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
    )
  } else {
    return (
      <Router>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StorageContextProvider>
            <ThemeProvider theme={currentTheme}>
              <CssBaseline />
              <TopMenuBar />
              <Nav onModeChange={handleThemeMode} logout={handleLogout} />
              <Content />
            </ThemeProvider>
          </StorageContextProvider>
        </LocalizationProvider>
      </Router>
    );
  }
}

export default App