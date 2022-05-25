import * as Yup from 'yup';
import { useState,useEffect} from 'react';
import {  useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import styled from 'styled-components';

// material
import {
  Alert,
  AlertTitle,
  Link,
  InputLabel,
  MenuItem,
  FormControl,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  FormHelperText,
  List,
  ListItem,
  Divider,
  ListItemText,
  Typography    
} from '@mui/material';


import Select, { SelectChangeEvent } from '@mui/material/Select';

import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import {useAuth} from '../../../hooks/authContext.js';


const roles = {
  names :{
       'PHI_ACCESS':'PHI access user',
       'NON_PHI':'Non-PHI access user',
       'ADMIN':'Administrator',
       'STUDY_ADMIN':'Study coordinator' },
  descriptions :{
       'PHI_ACCESS':'PHI access user can query, download, upload, and manually enter data.',
       'NON_PHI':'Non-PHI access user can only do query and download.',
       'ADMIN':'Administrator can define study tag, assign users to study, and create study templates.',
       'STUDY_ADMIN':'Study coordinator can change study tag Information, assign users to study, and create study templates.' }    
};



// ----------------------------------------------------------------------

export default function PostLoginForm() {
      const navigate = useNavigate();
      const [userInfo, setUserInfo] = useState(null);
      const [selTagInfo, setSelTagInfo] = useState(null);
      const [selTagIndex, setSelTagIndex] = useState(null);
      const [isDisabled, setIsDisabled] = useState(true);
      const [roleId, setRoleId] = useState('');
      const {loginContext, setLoginContext} = useAuth();
    
      const [error,setError] = useState(null);
     
    
      useEffect(() => {
        const fetchData = async () => {
           const response = await axios.get("https://btcdb-test.ucsf.edu/api/user", 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token    
                                    }}
                                    ).catch((err) => {
               if(err && err.response)
                  if(err.response.status != 200) 
                      setError("User name or Password is invalid");
            });    
            setUserInfo(response.data.principal);
        };
        fetchData();
        }, []);

    const PostLoginSubmit = async (values) => {
        setLoginContext({authority:roleId,selTag:selTagInfo});
        navigate('/dashboard/app');
    }  

    const formik = useFormik({
      initialValues: {
      email:'',
      password:'',
      remember: true
    },
    onSubmit:PostLoginSubmit,
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  
  const handleChange = (event: SelectChangeEvent) => {
    setRoleId(event.target.value);
    setIsDisabled((event.target.value !='ADMIN'))  
    setSelTagInfo(null);
    setSelTagIndex(null);  
      
  };
    
  const handleStudyChange = (event: SelectChangeEvent) => {
    setSelTagInfo(userInfo.tags[event.target.value]);
    setSelTagIndex(event.target.value);  
    setIsDisabled(false);    
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl sx={{ m: 1, minWidth: 120 }} >
              <InputLabel id="demo-select-small">Select Role</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={roleId}
                label="Select Role"
                onChange={handleChange}
              >
              {userInfo && userInfo.authorities && userInfo.authorities.map(function(rec, index){
                return <MenuItem value={rec.authority}>{roles.names[rec.authority]}</MenuItem>;
              })}
            </Select>
            <FormHelperText><strong>{roles.descriptions[roleId]}</strong></FormHelperText>
            </FormControl>
            	{
            		(roleId != 'ADMIN' && roleId != 'STUDY_ADMIN' && userInfo && (!userInfo.tags  ||  userInfo.length ==0 )) && 
                    <Alert severity="info"     variant="none"  >
                         <AlertTitle>No Studies associated with your account</AlertTitle>
                         Currently no studies are associated with your account.  
            			 <a href="mailto: yalan.zhang@ucsf.edu "> Please contact the Administrator.</a> 
                     </Alert>    
            	}
            	
            	{
            		(roleId == 'STUDY_ADMIN' && userInfo && (!userInfo.adminTags  ||  userInfo.adminTags.length ==0 )) && 
            		<Alert severity="info"     variant="none"  >
                         <AlertTitle>No Studies associated with your account</AlertTitle>
                         Currently no studies are associated with your account.  
            			 <a href="mailto: yalan.zhang@ucsf.edu "> Please contact the Administrator.</a> 
                    </Alert>   
            	}
            	{
            		(roleId && roleId != 'ADMIN'  && roleId != 'STUDY_ADMIN' && userInfo
            			&&  userInfo.tags &&  userInfo.tags.length >0 && 
        				<FormControl sx={{ m: 1, minWidth: 120 }} >
                            <InputLabel id="demo-select-small">Select Study</InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={selTagIndex}
                                label="Select Study"
                                onChange={handleStudyChange}
                                >
                                {userInfo && userInfo.tags && userInfo.tags.map(function(rec, index){
                                return <MenuItem value={index}>{rec.tagName}</MenuItem>;
                                })}
                            </Select>
                            {selTagInfo &&
                            <FormHelperText>
                               <strong> {'Investigator:'} </strong>
                               {' (' +selTagInfo.principalInvestigator} {') - '}       
                               <strong> {'Contact:'} </strong>
                               {' (' +selTagInfo.pointOfContact} {')'}      
                               <br/>
                               <strong> {'Description:'} </strong>
                               {selTagInfo.description}       
                            </FormHelperText>
                            }
                          </FormControl>
		        		)
            	}
                
               
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isDisabled}    
        >
          Continue
        </LoadingButton>
       </Stack>
      </Form>
    </FormikProvider>
  );
}
