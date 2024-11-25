
import React, {useState, useRef, useEffect} from 'react'

 
import {  Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'

import useStorage from '../api/useStorage'
import useEncryptedStorage from '../api/useEncryptedStorage'
import SimpleCamera from '../components/core/SimpleCamera'
import CameraCapture from '../components/CameraCapture'


const defaultPatient = {
    firstName: '',
    lastName: '',
    dodid: '',
    gender: [],
    bloodtype: '',
    dob: null,
    allergies: [],
    vitals: []
}

function NewPatientFormCamera(props) {
    const {
        open,
        close
    } = props

    const [modalImage, setModalImage] = useState(null);


const cameraStyles = {
    body: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      maxWidth: "800px",
      margin: "20px auto",
      padding: "0 20px",
    },
    cameraContainer: {
      position: "relative",
      width: "100%",
      maxWidth: "640px",
      margin: "20px 0",
    },
    video: {
      width: "100%",
      borderRadius: "8px",
      backgroundColor: "#f0f0f0",
    },
    buttonContainer: {
      margin: "20px 0",
      display: "flex",
      gap: "10px",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
    },
    disabledButton: {
      backgroundColor: "#cccccc",
      cursor: "not-allowed",
    },
    thumbnails: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      margin: "20px 0",
    },
    thumbnail: {
      width: "100px",
      height: "100px",
      borderRadius: "4px",
      cursor: "pointer",
      objectFit: "cover",
      border: "2px solid #ddd",
    },
    modal: {
      display: modalImage ? "flex" : "none",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalImage: {
      maxWidth: "90%",
      maxHeight: "90vh",
      borderRadius: "8px",
    },
    closeButton: {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "white",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "20px",
      border: "none",
      color: "black",
    },
    error: {
      padding: "10px",
      margin: "10px 0",
      borderRadius: "4px",
      backgroundColor: "#ffe6e6",
      color: "#dc3545",
    },
  };

    const [patients, setPatients] = useStorage('patients', {})
    const [patientsEncrypted, setEncryptedPatients] = useEncryptedStorage('encryptedPatients', {})
    const [patient, setPatient] = useState(defaultPatient)
    const [dodid, setDodId] = useState('')
    const [savedImages, setSavedImages] = useState([]);


    function setImageSource(dodid, imageSrc) {
      setSavedImages(imageSrc)
      console.log(imageSrc)
      alert(dodid)
    }

    function handleClose() {
        setPatient(defaultPatient)
        close()
    }

    function submit() {
        setPatients({ ...patients, [patient.dodid]: patient })
        setEncryptedPatients({ ...patientsEncrypted, [patient.dodid]: patient })
        setPatient(defaultPatient)
        console.log(patient.dodid)
       // capturePhoto()
       // saveToLocalStorage(patient.dodid)
        close()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            scroll="body"
        >
            <DialogTitle align="center">
                New Patient
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1} sx={{ marginTop: 1 }}>
                   
                <TextField
                        label="Patient Identifier"
                        required
                        value={patient.dodid}
                        onChange={event => setPatient({ ...patient, dodid: event.target.value })}
                        fullWidth
                    />
                    
                     <div className="flex justify-center mt-4">
                 {patient.dodid === '' ? <></> :  <CameraCapture setImageSource={setImageSource} dodid={patient.dodid} /> }
                     </div>
        
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    size="large"
                    aria-label="Cancel"
                >
                    Cancel
                </Button>
                <Button
                    onClick={submit}
                    variant="contained"
                    size="large"
                    disabled={patient.dodid.length === 0}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NewPatientFormCamera