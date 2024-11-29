// React
import React, {useState,useEffect} from 'react'

// MUI
import {  Box, Button, ButtonGroup, Card, CardActionArea, CardActions, CardHeader, Grid } from '@mui/material'
//import { useTheme } from '@mui/material/styles'

// MUI Icons
//import FolderIcon from '@mui/icons-material/Folder'


import useStorage from '../../api/useStorage'
import TCCC from '../../forms/tccc/TCCC'
import { useNavigate } from 'react-router-dom'
import VitalsForm from '../../forms/ae/VitalsForm'
import BlankTCCC from '../../forms/blankTccc/BlankTCCC'
import AddMedForm from '../../forms/tccc/AddMedForm'
import NotesForm from '../../forms/ae/NotesForm'
import CameraCapture from '../../components/CameraCapture'

function PatienIcon(props) {
  /*  const theme = useTheme()
   const statusLevel  = props.statusLevel !== undefined ? props.statusLevel : 3
    const {setStatusLevel} = props
    const statusColors = [
        theme.palette.error.dark,
        theme.palette.warning.dark,
        theme.palette.success.dark,
        undefined
    ]
*/
    return (
        <img height='50px' src={props.img} alt="person"/>
        /*<Avatar
            onClick={handleClick}
            sx={{
                bgcolor: statusColors[statusLevel % statusColors.length]
            }}
        >
            <FolderIcon />
        </Avatar> */
    )
}

function PatientCard(props) {
    const {
        firstName,
        lastName,
        dodid
    } = props

    const [savedImages, setSavedImages] = useState([]);
    const [patientImg, setPatientImg] = useState('/nopicture.png');

    const [patients, setPatients] = useStorage('patients', {})
    const patient = patients[dodid]

    const [docs] = useStorage(`${dodid}-documents`, [])
    const navigate = useNavigate()
    
    useEffect(() => {
        const stored = localStorage.getItem('savedImages-' + dodid);
      
        if (stored) {
          setSavedImages(JSON.parse(stored));

        }
        if (stored ) {
            setPatientImg(JSON.parse(stored)[0].imgData)
        }
    }, [dodid]);

    let tccc = null
    for (let index in docs) {
        let doc = docs[index]
        if (doc.name === "Tactical Casualty Care Card") {
            tccc = doc
        }
    }

    const [tcccOpen, setTccOpen] = React.useState(false)
    const [vitalsOpen, setVitalsOpen] = React.useState(false)
    const [medsOpen, setMedsOpen] = React.useState(false)
    const [notesOpen, setNotesOpen] = React.useState(false)

    function close() {
        setTccOpen(false)
        setVitalsOpen(false)
        setMedsOpen(false)
        setNotesOpen(false)
    }

    function updatePatient(key, value) {
        let newPatient = {
            ...patient,
            [key]: value
        }
        setPatients({
            ...patients,
            [dodid]: newPatient
        })
    }

    function addEntry(data) {
        updatePatient("vitals", [...patient.vitals || [], data])
    }

    function addMedsEntry(data) {
        updatePatient("meds", [...patient.meds || [], data])
    }

    function addNotesEntry(data) {
        // we're changing orders to notes
        updatePatient("orders", [...patient.orders || [], data])
    }

    function setStatusLevel(newValue) {
        updatePatient("statusLevel", newValue)
    }
    
    return (
        <Grid item xs={12}>
            <Card>
                <CardActionArea
                    aria-label={`Open ${dodid}`}
                    onClick={() => navigate(`/patients/ae/${dodid}`)}
                >
                   
                    <CardHeader
                        title={`${firstName} ${lastName}`}
                        titleTypographyProps={{ variant: "h6" }}
                        subheader={dodid}
                        avatar={<PatienIcon img={patientImg} allimg={savedImages} statusLevel={patient.statusLevel} setStatusLevel={setStatusLevel} />}
                    />
        
                </CardActionArea>
                <CardActions>
                    <Box sx={{ flexGrow: 1 }} />
                    <ButtonGroup>
                        <Button
                            variant="contained"
                            onClick={() => setTccOpen(true)}
                        >
                            TCCC
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setVitalsOpen(true)}
                        >
                            Vitals
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setMedsOpen(true)}
                        >
                            Meds
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setNotesOpen(true)}
                        >
                            Notes
                        </Button>
                    </ButtonGroup>
                </CardActions>
            </Card>
            {
                tccc ?
                    <TCCC
                        open={tcccOpen}
                        close={close}
                        data={tccc.data}
                    />
                    :
                    <BlankTCCC
                        open={tcccOpen}
                        close={close}
                        patient={patient}
                    />
            }
            <VitalsForm
                open={vitalsOpen}
                close={close}
                addEntry={addEntry}
            />
            <AddMedForm
                open={medsOpen}
                close={close}
                addMedication={addMedsEntry}
            />
            <NotesForm
                open={notesOpen}
                close={close}
                addNote={addNotesEntry}
            />
            <CameraCapture/>
        </Grid>
    )
}

export default PatientCard