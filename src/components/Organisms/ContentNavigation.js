import React, { Suspense } from 'react'

import { Grid, LinearProgress } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Patients from '../../content/Patients'
import PatientPage from '../../content/PatientPage'
import TucsPage from '../../content/TucsPage'
import PatientListing from '../../content/ae/PatientListing'
import AEPatientPage from '../../content/ae/PatientPage'
import TriagePage from '../../content/Triage'

function ContentNavigation(props) {
    
    return (
        <Grid
            container
            spacing={1}
            sx={{
                paddingLeft: "7px",
                paddingRight: "7px",
                marginTop: "7px",
                alignContent: "stretch"
            }}
        >
            <Suspense fallback={<LinearProgress />}>
                <Routes>
                    <Route
                        path="/"
                        element={<PatientListing />}
                    />
                    <Route
                        path="/patients"
                        element={<Patients />}
                    />
                    <Route
                        path="/patients/:dodid"
                        element={<PatientPage />}
                    />
                    <Route
                        path="/tucs"
                        element={<TucsPage />}
                    />
                    <Route
                        path="/patients/ae/:dodid"
                        element={<AEPatientPage />}
                    />
                    <Route
                        path="/triage"
                        element={<TriagePage />}
                    />
                </Routes>
            </Suspense>
        </Grid>
    )
}

export default ContentNavigation