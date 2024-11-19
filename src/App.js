// React
import React, { useState } from 'react'

// router
import { BrowserRouter, HashRouter } from "react-router-dom"

// MUI
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

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
 
  const handleThemeMode = (value) => {
    setThemeMode(value);
  };

  let currentTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });
  
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StorageContextProvider>
          <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <TopMenuBar/>
            <Nav onModeChange={handleThemeMode} />
            <Content />
          </ThemeProvider>
        </StorageContextProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App