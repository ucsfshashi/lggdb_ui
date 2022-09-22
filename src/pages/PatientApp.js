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


  const {loginContext,setLoginContext} = useAuth();   
  const navigate = useNavigate();    
  const [parentInfo, setParentInfo] = useState(null);
  const [grandInfo, setGrandInfo] = useState(null);
  const [data, setData] = useState(null);
  
  const handleEditClick=(event,info) => {
	   event.preventDefault(); 
	   setLoginContext({mode:'edit'});
	   setData(info);
  };
  
  const goBackToList=(event,topic) => {
	  
	  if(topic){
		  setLoginContext({topic:topic});
	  }
	  
	  setLoginContext({mode:'view'});
   };
   
   const onNavigateClick=(event,parentInfo,topic,grandInfo) => {
	      setLoginContext({topic:topic});
	      setLoginContext({mode:'view'});
		  setParentInfo(parentInfo);
		  setGrandInfo(grandInfo);
		  
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
          mode={loginContext.mode} 
          data={data} 
          parentInfo={parentInfo}
          grandInfo={grandInfo}
          onNavigateClick={(event,parentInfo,topic,grandInfo) => onNavigateClick(event,parentInfo,topic,grandInfo)}
          goBackToList={(event,topic) => goBackToList(event,topic)}
          onEditClick={(event, data) => handleEditClick(event, data)}	  
          loginContext={loginContext} />
      </Container>
    </Page>
  );
}
