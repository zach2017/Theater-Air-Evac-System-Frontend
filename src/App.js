// React
import React, { useState, useEffect } from 'react'

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
import { ChromeIdentity } from './security/identity';

// Get device ID on registration

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
  const [loading, setLoading] = useState(true);

  const [themeMode, setThemeMode] = useState("dark");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();

  useEffect(() => {
    verifyDeviceAuth();
  }, []);

  async function verifyDeviceAuth() {
    try {
      const storedId = localStorage.getItem('deviceId');
      const isValid = await ChromeIdentity.verifyIdentity(storedId);
      if (isValid) {
        const encryptedData = JSON.parse(localStorage.getItem('userData'));
        const key = await ChromeIdentity.generateKey('userPassword', storedId);
        const decrypted = await ChromeIdentity.decrypt(encryptedData, key);
       // setUserData(decrypted);
        setIsAuthenticated(true);
      }
  } catch (error) {
    console.error('Auth failed:', error);
  } finally {
    setLoading(false);
  }
}
async function handleLogin2(password) {
  const deviceId = await ChromeIdentity.getDeviceIdentity();
  const key = await ChromeIdentity.generateKey(password, deviceId);
  
  const userData = {
    id: 'user123',
    name: 'John Doe',
    settings: { theme: 'dark' }
  };

  console.log(deviceId)

  const encrypted = await ChromeIdentity.encrypt(userData, key);
  localStorage.setItem('deviceId', deviceId);
  localStorage.setItem('userData', JSON.stringify(encrypted));
  
  //setUserData(userData);
  setIsAuthenticated(true);
}

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      handleLogin2(password)
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