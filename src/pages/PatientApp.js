// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';

import {useAuth} from '../hooks/authContext.js';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import { useNavigate } from "react-router-dom";
import PatientRouter from '../manual_ui/patient_router';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function PatientApp() {


  const {loginContext} = useAuth();   
  const navigate = useNavigate();    
  const [mode, setMode] = useState(null);
  const [parentInfo, setParentInfo] = useState(null);
  const [grandInfo, setGrandInfo] = useState(null);
  const [data, setData] = useState(null);
  
  const handleEditClick=(event,info) => {
	   event.preventDefault(); 
	   setMode('edit');
	   setData(info);
  };
  
  const goBackToList=(event) => {
	   setMode('view');
   };
    
  return (
    <Page title="Patient-{loginContext.mrn}">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>    
          <Typography variant="h4">{loginContext.mrn}</Typography>
          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/dashboard/patients")}>
            <ResetTvIcon fontSize="inherit" />
          </IconButton>
        </Stack>
        </Box>
        <PatientRouter 
          topicName={loginContext.topic} 
          mode={mode} 
          data={data} 
          goBackToList={(event) => goBackToList(event)}
          onEditClick={(event, data) => handleEditClick(event, data)}	  
          loginContext={loginContext} />
      </Container>
    </Page>
  );
}
