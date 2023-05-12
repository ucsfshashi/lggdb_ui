import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import configData from "../../../config.json";
import PersonAddIcon from '@mui/icons-material/PersonAdd';


// material
import {
  Alert,
  AlertTitle,
  Link,
  Stack,
  Checkbox,
  Toolbar,
  Button,
  TextField,
  Container,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Box,
  IconButton,
  Typography,
  AppBar,
  LinearProgress,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import Page from '../../../components/Page';

import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import {useAuth} from '../../../hooks/authContext.js';
import ResetTvIcon from '@mui/icons-material/ResetTv';

// ----------------------------------------------------------------------

export default function Templates({selTagInfo,goBackList}) {
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const [successMsg,setSuccessMsg] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(false); 
  const [isNewStudy, setIsNewStudy] = useState(false); 
  const [nonPhiUsers, setNonPhiUsers] = useState([]);  
  const [phiUsers, setPhiUsers] = useState([]);
  
  const [assignNonPhiUsers, setAssignNonPhiUsers] = useState([]);  
  const [assignPhiUsers, setAssignPhiUsers] = useState([]);
  
  
  useEffect(() => {
	  loadLggdbPhiUsers();
	  loadLggdbNonPhiUsers();
	  loadStudyUsers();
	  }, []);
  
  
  
  const loadStudyUsers = async () => {
	  
	  var url = loginContext.apiUrl+"/studyTag/"+selTagInfo.tagId+"/users";
 	 
	  const response = await axios.get(url, 
                              {headers:{
                                'Content-Type' :'applicaiton/json',
                                'X-Requested-With':'XMLHttpRequest', 
                                'UCSFAUTH-TOKEN':loginContext.token
                              }}
                              ).catch((err) => {
         if(err && err.response)
            if(err.response.status != 200) 
                setError("Unable to load users");
        });
	  
	  if(response && response.data) {
		  var lData = response.data;
		  setAssignNonPhiUsers(lData.nonPhiUsers);
		  setAssignPhiUsers(lData.users);
       }
  }
  
  
  const loadLggdbPhiUsers = async () => {
	  var url = loginContext.apiUrl+"/lggdbUser/list";
 	 
	  const response = await axios.get(url, 
                              {headers:{
                                'Content-Type' :'applicaiton/json',
                                'X-Requested-With':'XMLHttpRequest', 
                                'UCSFAUTH-TOKEN':loginContext.token
                              }}
                              ).catch((err) => {
         if(err && err.response)
            if(err.response.status != 200) 
                setError("Unable to load users");
        });
	  
	  if(response && response.data) {
		  var lData = response.data;
		  if(lData) {
			  lData =lData.filter(word => word.authorities.indexOf('PHI_ACCESS') != -1);
    		  lData = lData.map((fieldOption) => {
    			  	return {value: fieldOption.username, label: fieldOption.username};
  		    	});
		  }
		  setPhiUsers(lData);
       }
  }
  
  
  const loadLggdbNonPhiUsers = async () => {
	  var url = loginContext.apiUrl+"/lggdbUser/list";
 	 
	  const response = await axios.get(url, 
                              {headers:{
                                'Content-Type' :'applicaiton/json',
                                'X-Requested-With':'XMLHttpRequest', 
                                'UCSFAUTH-TOKEN':loginContext.token
                              }}
                              ).catch((err) => {
         if(err && err.response)
            if(err.response.status != 200) 
                setError("Unable to load users");
        });
	  
	  if(response && response.data) {
		  var lData = response.data;
		  if(lData) {
			  lData =lData.filter(word => word.authorities.indexOf('NON_PHI') != -1);
    		  lData = lData.map((fieldOption) => {
    			  	return {value: fieldOption.username, label: fieldOption.username};
  		    	});
		  }
		  setNonPhiUsers(lData);
       }
  }
  
  const assignNonPhiUsersSubmit = async(evt) => {
	  setLoading(true);
	  var url = loginContext.apiUrl+"/studyTag/"+selTagInfo.tagId+"/users/nonphi";
	 	 
	  const headers = { 
	   		   'Content-Type' :'application/json',
	           'X-Requested-With':'XMLHttpRequest',
	           'UCSFAUTH-TOKEN':loginContext.token
	   	 		 };
		  
		
      //Saving data type changes
	  var rInfo=await axios.post(url, 
			  JSON.stringify(assignNonPhiUsers), { headers }).catch((err) => {
					if(err && err.response)
						if(err.response.status != 200) 
							setError("Error while assigning nonphi users");
						});  
	  
	  if(rInfo && rInfo.status == 200) {
		  setSuccessMsg("Assign nonphi users successfully");
	  }
	  
	  
	  setLoading(false);
  }
  
  const assignPhiUsersSubmit = async(evt) => {
	  
  	  setLoading(true);
	  var url = loginContext.apiUrl+"/studyTag/"+selTagInfo.tagId+"/users/phi";
	 	 
	  const headers = { 
	   		   'Content-Type' :'application/json',
	           'X-Requested-With':'XMLHttpRequest',
	           'UCSFAUTH-TOKEN':loginContext.token
	   	 		 };
		  
		
      //Saving data type changes
	  var rInfo=await axios.post(url, 
			  JSON.stringify(assignPhiUsers), { headers }).catch((err) => {
					if(err && err.response)
						if(err.response.status != 200) 
							setError("Error while assigning phi users");
						});    
	  
	  
	  if(rInfo && rInfo.status == 200) {
		  setSuccessMsg("Assign phi users successfully");
	  }
	  
	  setLoading(false);
		   
  }
  
  const handleNonPhiUser =(evt) => {
	  console.log(evt.target.value);
	  console.log(assignNonPhiUsers);
	  setAssignNonPhiUsers(evt.target.value);
  }
  
  const handlePhiUser =(evt) => {
	  console.log(assignPhiUsers);
	  console.log(evt.target.value);
	  setAssignPhiUsers(evt.target.value);
  }
      
  return (
		  <Page title="Studies">
	       
		  <Stack > 
		  	
	       	<Box sx={{ pb: 5 }}>
	        <Stack direction="row" alignItems="center" spacing={0.5}>    
	          <Typography variant="h4">Studies : {selTagInfo.tagName} </Typography>
	          <IconButton aria-label="restart" size="medium"  onClick={() => goBackList()}>
	            <ResetTvIcon color="success" fontSize="inherit" />
	          </IconButton>    
	        </Stack>
	        </Box>
	        
	        <Stack sx={{
		        width: '40%',
		      }}>
	        	<AppBar position="static" color='transparent' variant="dense" >
	        		<Toolbar variant="dense">
	        			<Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
	        			<Iconify color="success" 	 icon={'eva:person-done-fill'} width={22} height={22} /> Assign users
	      				</Typography>
	        		{ successMsg && 
	        			<Alert severity="success">
	        				{successMsg}
	        			</Alert>
	        		}
	        		
	        		{ error && 
	        			<Alert severity="error">
	        				{error}
	        			</Alert>
	        		} 
	        		
	        		</Toolbar>
	        	</AppBar>
	    	</Stack>	        
	       
	        <br/>
	        
	        <Stack direction="row" alignItems="center" spacing={1}>  
	        
	          <FormControl sx={{ m: 1, minWidth: 120 }} >
	          <InputLabel id="demo-select-role">Phi users</InputLabel>
	          <Select
	            multiple
	            sx={{ 'width':'825px' }} 
	            labelId="demo-select-role"
	            id="phiUsers"
	            label="Phi users"
	            input={<OutlinedInput label="Tag" />}
	            renderValue={(selected) => selected.join(', ')}	
	            onChange={(e) => handlePhiUser(e)}  
	            value={assignPhiUsers}
	           >
	          {phiUsers && phiUsers.map(function(rec, index){
	              return <MenuItem value={rec.value}>
		                      <Checkbox checked={assignPhiUsers.indexOf(rec.value) > -1} />
		                      <ListItemText primary={rec.label} />
	              		 </MenuItem>;
	              })}
	          </Select>
	          </FormControl>
	          <LoadingButton  sx={{ marginBottom:'5px' }} loading={loading} loadingPosition="start" variant="contained"  onClick={(e)=>assignPhiUsersSubmit(e)} size='large' startIcon={<PersonAddIcon />}>
  					Assign phi users
			  </LoadingButton>	
	        </Stack>
	        
	        <br/>
	        <br/>
	        
	        <Stack direction="row" alignItems="center" spacing={1}>  
	        
	          <FormControl sx={{ m: 1, minWidth: 120 }} >
	          <InputLabel id="demo-select-role">Non phi users</InputLabel>
	          <Select
	            multiple
	            sx={{ 'width':'825px' }} 
	            labelId="demo-select-role"
	            id="nonPhiUsers"
	            label="Nonphi users"
	            input={<OutlinedInput label="Tag" />}
	            value={assignNonPhiUsers}
	            onChange={(e) => handleNonPhiUser(e)}  
	            renderValue={(selected) => selected.join(', ')}	
	           >
	          {nonPhiUsers && nonPhiUsers.map(function(rec, index){
	              return <MenuItem value={rec.value}>
		                      <Checkbox checked={assignNonPhiUsers.indexOf(rec.value) > -1} />
		                      <ListItemText primary={rec.label} />
	              		 </MenuItem>;
	              })}
	          </Select>
	          </FormControl>
	          
	      	<LoadingButton  sx={{ marginBottom:'5px' }} loading={loading} loadingPosition="start" variant="contained"  onClick={(e)=>assignNonPhiUsersSubmit(e)} size='large' startIcon={<PersonAddIcon />}>
	      		Assign non-phi users
			</LoadingButton>	
	          
		    </Stack>
	      
	        </Stack>
    	   </Page>
  );
}
