import * as Yup from 'yup';
import { useState,useEffect,Fragment } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, Typography,
	Alert,
	AlertTitle,
	Link,InputAdornment,FormControl,InputLabel,MenuItem,FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import configData from "../../../config.json";
import {useAuth} from '../../../hooks/authContext.js';



// ----------------------------------------------------------------------

const roles = [{id:"PHI_ACCESS",name:"PHI access user",description:"PHI access user can query, download, upload, and manually enter data."},
	           {id:"NON_PHI",name:"Non-PHI access user",description:"Non-PHI access user can only do query and download."}];


export default function RegisterForm() {
  const navigate = useNavigate();
  
  const [tagsInfo, setTagsInfo] = useState(null);
  const [error, setError] = useState(null);
  const [selTagInfo, setSelTagInfo] = useState(null);
  const [selRole, setSelRole] = useState(null);
  const [selTagIndex, setSelTagIndex] = useState(null);
  const [tagSelected, setTagSelected] = useState(false);
  const [roleSelected, setRoleSelected] = useState(false);
  const [createResponse, setCreateResponse] = useState(null);
  const [openTerms, setOpenTerms] = useState(false);
  const {loginContext, setLoginContext} = useAuth();





  useEffect(() => {
      const fetchData = async () => {
         const response = await axios.get(configData.apiUrl+"/nosession/tagList", 
                                  {headers:{
                                    'Content-Type' :'applicaiton/json',
                                    'X-Requested-With':'XMLHttpRequest' 
                                  }}
                                  ).catch((err) => {
             if(err && err.response)
                if(err.response.status != 200) 
                	setError("Error while fetching taglist");
          });    
          setTagsInfo(response.data);
      };
      fetchData();
      }, []);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    username: Yup.string().email('Email must be a valid email address').required('Email is required').matches('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@ucsf.edu','Endter valid UCSF email address')
    
  });
  
  const registrationSubmit = async (values) => {
      
	  
	  const headers = { 
   		   'Content-Type' :'application/json',
          'X-Requested-With':'XMLHttpRequest'
   	  };
	  
	  var data=values;

	  setLoginContext({apiUrl:configData.apiUrl})
	  
	  var rInfo = await axios.post(configData.apiUrl+"/nosession/createUser/"+selRole.id+"/"+selTagInfo.tagId, 
			  JSON.stringify(data), { headers }).catch((err) => {
					if(err && err.response)
						if(err.response.status != 200) 
						setError("Error while fetching taglist");
						});    
	  
	  if(rInfo.status==208) {
		  setCreateResponse("ALREADY_EXIST");
	  } else if(rInfo.status==200) {
		  setCreateResponse("SUCCESS");
	  }
	  
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
     username: ''
    },
    validationSchema: RegisterSchema,
    onSubmit:registrationSubmit

  });

  
  const handleStudyChange = (event: SelectChangeEvent) => {
	    setSelTagInfo(tagsInfo[event.target.value]);
	    setSelTagIndex(event.target.value);  
	    setTagSelected(true);    
  };
  
  const handleSelectRole = (event: SelectChangeEvent) => {
	    setSelRole(roles[event.target.value]);
	    setRoleSelected(true);    
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

		  const openInNewTab = (url) => {
			    setOpenTerms(true);
			    window.open(url, '_blank', 'noreferrer');
			  };
		  
  
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        
      { !createResponse &&	
      <Stack spacing={3}>
           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <FormControl sx={{ m: 1, minWidth: 120 }} >
          <InputLabel id="demo-select-role">Select access level</InputLabel>
          <Select
            labelId="demo-select-role"
            id="demo-select-role"
            {...getFieldProps('roleId')}
            label="Select Role"
            onChange={handleSelectRole}
           >
          {roles && roles.map(function(rec, index){
              return <MenuItem value={index}>{rec.name}</MenuItem>;
              })}
        </Select>
        <FormHelperText><strong>{selRole && selRole.description}</strong></FormHelperText>
        </FormControl>
        
        
        <FormControl sx={{ m: 1, minWidth: 120 }} >
        <InputLabel id="demo-select-study">Select study</InputLabel>
        <Select
          labelId="demo-select-study"
          id="demo-select-study"
          {...getFieldProps('studyId')}
          label="Select Study"
          onChange={handleStudyChange}
        >
          {tagsInfo && tagsInfo.map(function(rec, index){
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
     
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
      <b>	
      By registering, I agree to UCSF Health &nbsp;
      <Link   underline="hover" style={{ cursor: 'pointer' }} color="textPrimary" onClick={() => openInNewTab('https://www.ucsfhealth.org/website-privacy-policy#:~:text=We%20may%20collect%20the%20following,symptoms%2C%20health%20conditions%20and%20medications')} >
        Terms of Service
           &
        Privacy Policy
      </Link>
     </b>   
     </Typography>
      
      <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={!(formik.isValid && formik.dirty) || !tagSelected || !roleSelected ||  !openTerms}
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
         </Stack>
         }
         {createResponse &&	createResponse=="SUCCESS" &&
           <Stack spacing={3}>
         		
	         <Alert severity="error"     variant="none"  >
	         	<AlertTitle> BTCDB user registration</AlertTitle>
	         	 <b>BTCDB account request successfully submitted</b>    
	         	<br/>
	         	Your BTCDB account request was successfully submitted. Please note that your account activation requires review and approval from the BTCDB core team. You will receive an email shortly with further instructions and additional information needed for account approval and activation.
	         	<br/><br/>
	         	<b>If you didn't receive an email from the BTCDB team  <a href="mailto: BTCDB-Support@ucsf.edu "> please contact the BTCDB team.</a> </b>
			 </Alert>   
         
         	</Stack>
         }	{createResponse &&	createResponse=="ALREADY_EXIST" && 
             <Stack spacing={3}>
  		
         <Alert severity="error"     variant="none"  >
         	<AlertTitle> BTCDB account already exists with the provided email</AlertTitle>
         
         	BTCDB account already exists with the provided email.     
         	<br/>
         	Please try <b> <Link underline="hover" to="/login" component={RouterLink}>
              Login
              </Link></b> or <b><Link underline="hover" to="/forgot" component={RouterLink}>Forgot password</Link></b> options. 
         	<br/><br/>
         	<b> Still have an issue? <a href="mailto: BTCDB-Support@ucsf.edu "> Please contact the BTCDB team.</a> </b>
		 </Alert>   
     
     	</Stack>
     }	
      </Form>
    </FormikProvider>
  );
}
