// React
import React, { useState } from 'react'

// router
import { BrowserRouter, HashRouter } from "react-router-dom"

// MUI
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ProtectedRoute from './security/ProtectedRoute'
import ContentNavigation from './components/Organisms/ContentNavigation'

import TopMenuNavigation
 from './components/Organisms/TopMenuNavigation'
import { StorageContextProvider } from './context/StorageContext'

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

  const handleThemeMode = (value) => {
    setThemeMode(value);
  };

  let currentTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <ProtectedRoute>
      <Router>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StorageContextProvider>
            <ThemeProvider theme={currentTheme}>
              <CssBaseline />
              <TopMenuNavigation onModeChange={handleThemeMode} />
              <ContentNavigation />
            </ThemeProvider>
          </StorageContextProvider>
        </LocalizationProvider>
      </Router>
    </ProtectedRoute>
  );

}

export default App