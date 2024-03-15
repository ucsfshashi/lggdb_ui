import * as Yup from 'yup';
import { useState,useEffect,Fragment} from 'react';
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
  Typography,
  Box,    
} from '@mui/material';


import Select, { SelectChangeEvent } from '@mui/material/Select';

import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import {useAuth} from '../../../hooks/authContext.js';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


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
      
      const {loginContext, setLoginContext} = useAuth();
      const [userInfo, setUserInfo] = useState(null);
      const [userTags, setUserTags] = useState(null);
      const [selTagInfo, setSelTagInfo] = useState(loginContext.selTag);
      const [selTagIndex, setSelTagIndex] = useState(null);
      const [isDisabled, setIsDisabled] = useState(true);
      const [roleId, setRoleId] = useState(loginContext.authority);
      
    
      const [error,setError] = useState(null);
     
    
      useEffect(() => {
        const fetchData = async () => {
        	
        	
           const response = await axios.get(loginContext.apiUrl+"/user", 
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
            
            if(response.data.principal.tags && response.data.principal.tags.length >0 ){
	            let tags = response.data.principal.tags.sort((a, b) => {
	            	  const nameA = a.tagName.toUpperCase(); // ignore upper and lowercase
	            	  const nameB = b.tagName.toUpperCase(); // ignore upper and lowercase
	            	  if (nameA < nameB) {
	            	    return -1;
	            	  }
	            	  if (nameA > nameB) {
	            	    return 1;
	            	  }
	
	            	  // names must be equal
	            	  return 0;
	            	});
	            setUserTags(tags);
	        }
            
           
            if(loginContext.selTag && response.data.principal ) {
                var selTagIndex = response.data.principal.tags.map(object => object.tagId).indexOf(loginContext.selTag.tagId);
                setSelTagIndex(selTagIndex);
                
                if(selTagIndex != -1) {
                    setIsDisabled(false);
                }
            }
            
            
            
        };
        fetchData();
        }, []);

    const PostLoginSubmit = async (values) => {
        setLoginContext({selRole:roleId,selTag:selTagInfo,displayName:userInfo.displayName,userName:userInfo.username});
       
        if(roleId=='PHI_ACCESS' || roleId=='NON_PHI') {
            fetchSchema();
        } else {
            navigate('/admin/app');    
        }
    }  
    
    const fetchSchema = async () => {
       const response = await axios.get(loginContext.apiUrl+"/schema?phi="+roleId+"&requestFor=INPUTUI", 
                                {headers:{
                                  'Content-Type' :'applicaiton/json',
                                  'X-Requested-With':'XMLHttpRequest', 
                                  'UCSFAUTH-TOKEN':loginContext.token,
                                  'tagId':selTagInfo.tagId,          
                                }}
                                ).catch((err) => {
           if(err && err.response)
              if(err.response.status != 200) 
                  setError("User name or Password is invalid");
        }); 
        setLoginContext({schema:response.data});
        navigate('/dashboard/app');   
    };

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
    setIsDisabled(!(event.target.value =='ADMIN' || event.target.value =='STUDY_ADMIN'))  
    setSelTagInfo(null);
    setSelTagIndex(null);  
      
  };
    
  const handleStudyChange = (event: SelectChangeEvent) => {
    setSelTagInfo(userTags[event.target.value]);
    setSelTagIndex(event.target.value);  
    setIsDisabled(false);    
  };
    
    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    border: '1px solid #dadde9',
    width:'100%',  
  },
}));
    
  function truncate(str, n){
     return (str.length > n) ? str.substr(0, n-1) + ' ...': str;
  };    

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
        
        <Typography variant="string" component="h3" sx={{ color: 'green' }}>
        {loginContext.username}
       </Typography>
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
            		(roleId != 'ADMIN' && roleId != 'STUDY_ADMIN' && userInfo && (!userTags  ||  userInfo.length ==0 )) && 
                    <Alert severity="info"     variant="none"  >
                         <AlertTitle>No Studies associated with your account</AlertTitle>
                         Currently no studies are associated with your account.  
            			 <a href="mailto: lucie.mccoy@ucsf.edu "> Please contact the Administrator.</a> 
                     </Alert>    
            	}
            	
            	{
            		(roleId == 'STUDY_ADMIN' && userInfo && (!userInfo.adminTags  ||  userInfo.adminTags.length ==0 )) && 
            		<Alert severity="info"     variant="none"  >
                         <AlertTitle>No Studies associated with your account</AlertTitle>
                         Currently no studies are associated with your account.  
            			 <a href="mailto: lucie.mccoy@ucsf.edu "> Please contact the Administrator.</a> 
                    </Alert>   
            	}
            	{
            		(roleId && roleId != 'ADMIN'  && roleId != 'STUDY_ADMIN' && userInfo
            			&&  userTags &&  userTags.length >0 && 
        				<FormControl sx={{ m: 1, minWidth: 120 }} >
            			
                            <InputLabel id="demo-select-study-small">Select Study</InputLabel>
                            <Select
                                labelId="demo-select-study-small"
                                id="demo-select-study-small"
                                value={selTagIndex}
                                label="Select Study"
                                onChange={handleStudyChange}
                                >
                                {userInfo && userTags && userTags.map(function(rec, index){
                                return <MenuItem value={index}>{rec.tagName}</MenuItem>;
                                })}
                            </Select>
                            {selTagInfo &&
                            <FormHelperText>
                               <strong> {'Investigator:'} </strong>
                               {' ' +selTagInfo.principalInvestigator} {' - '}       
                               <strong> {'Contact:'} </strong>
                               {' ' +selTagInfo.pointOfContact} {''}      
                               <br/>
                              <HtmlTooltip
                                    title={
                                        <Fragment>
                                           <Typography color="inherit">{selTagInfo.tagName}</Typography>
                                           <Typography variant="body2">
                                                        {selTagInfo.description}
                                            </Typography>
                                        </Fragment>
                                        }
                                >
                                    <Link underline="none" sx={{cursor:'pointer',color:'#637381'}}>
                                   <strong> {'Description:'} </strong>
                                   {truncate(selTagInfo.description,140)}
                                    </Link>
                               </HtmlTooltip>
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
