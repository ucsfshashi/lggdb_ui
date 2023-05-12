import * as Yup from 'yup';
import { useState,useEffect,Fragment } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, Typography,
	Checkbox,
	ListItemText,
	OutlinedInput,
	ToggleButton,
	ToggleButtonGroup,
	FormControl,InputLabel,MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styled from 'styled-components';
import configData from "../../../config.json";
import {useAuth} from '../../../hooks/authContext.js';

const roles = [{id:"PHI_ACCESS",name:"PHI access user"},
    		  {id:"NON_PHI",name:"Non-PHI access user"},
    		  {id:"STUDY_NAME",name:"Study co-ordinator"},
    		  {id:"ADMIN",name:"Adminstrator"}];

export default function SaveUserForm({goBackList,selUserInfo}) {
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [selRole, setSelRole] = useState(null);
  const [createResponse, setCreateResponse] = useState(null);
  const {loginContext, setLoginContext} = useAuth();

  useEffect(() => {
      const fetchData = async () => {};
      fetchData();
      }, []);

    
  const RegisterSchema = Yup.object().shape({
	  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name is required'),
      lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name is required')
  });
  
  const handleChange = (
		    event: React.MouseEvent<HTMLElement>,
		    newAlignment: string,
		  ) => {
			  formik.setFieldValue("enabled", newAlignment);
  };
  
  const registrationSubmit = async (values) => {
      
	  const headers = { 
   		   'Content-Type' :'application/json',
           'X-Requested-With':'XMLHttpRequest',
           'UCSFAUTH-TOKEN':loginContext.token
   	  };
	  
	  var data=values;

	  setLoginContext({apiUrl:configData.apiUrl})
	  
	  var rInfo=await axios.post(configData.apiUrl+"/lggdbUser/save", 
			  JSON.stringify(data), { headers }).catch((err) => {
					if(err && err.response)
						if(err.response.status != 200) 
						setError("Error while fetching taglist");
						});    
	  
	  if(rInfo.status==208) {
		  setCreateResponse("ALREADY_EXIST");
	  } else if(rInfo.status==200) {
		  window.location.reload(false);
		  setCreateResponse("SUCCESS");
	  }
	  
  };

  const formik = useFormik({
    initialValues: {
    	username: selUserInfo?selUserInfo.username:null,
    	firstName: selUserInfo?selUserInfo.firstName:'',
    	lastName: selUserInfo?selUserInfo.lastName:'',
    	enabled: selUserInfo?selUserInfo.enabled:'',
    	authorities: selUserInfo?selUserInfo.authorities:[],
    },
    validationSchema: RegisterSchema,
     onSubmit:registrationSubmit
  });

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

		  
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        
      { !createResponse &&	
      <Stack spacing={3}  sx={{ 'paddingLeft':'100px','paddingTop':'50px','paddingBottom':'50px' }}  >
      		<TextField
      		  sx={{ 'width':'450px' }} 
      		  label="User name"
      		  disabled={selUserInfo!=null}	  
              {...getFieldProps('username')}
              error={Boolean(touched.tagName && errors.tagName)}
              helperText={touched.tagName && errors.tagName}
            />
	       
           <Stack direction={{ xs: 'column', sm: 'row' }}  spacing={2}>
	          <TextField
	          sx={{ 'width':'400px' }} 
	          label="First name"
	          {...getFieldProps('firstName')}
	          error={Boolean(touched.principalInvestigator && errors.principalInvestigator)}
	          helperText={touched.principalInvestigator && errors.principalInvestigator}
	          />   
	 
	          <TextField
	          sx={{ 'width':'400px' }} 
	          label="Last Name"
	          {...getFieldProps('lastName')}
	          error={Boolean(touched.pointOfContact && errors.pointOfContact)}
	          helperText={touched.pointOfContact && errors.pointOfContact}
	          />   
	       </Stack>  
	       <Stack direction={{ xs: 'column', sm: 'row' }}   spacing={2}>   
	           <Typography variant="h7" sx={{'paddingTop':'12px'}} >Status :</Typography>
	       		<ToggleButtonGroup
		          color="primary"
		          value={formik.values.enabled}
	              onChange={handleChange}
		          exclusive
		          aria-label="Platform">
		          <ToggleButton value="Yes" selected={formik.values.enabled =='Yes'} >Enable</ToggleButton>
		          <ToggleButton value="No" selected={formik.values.enabled =='No'} >Disable</ToggleButton>
		        </ToggleButtonGroup>  
	        </Stack> 
	        
          <FormControl sx={{ m: 1, minWidth: 120 }} >
          <InputLabel id="demo-select-role">Study Coordinators</InputLabel>
          <Select
            multiple
            sx={{ 'width':'825px' }} 
            labelId="demo-select-role"
            id="demo-select-role"
            {...getFieldProps('authorities')}
            label="Authorities"
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}	
           >
          {roles && roles.map(function(rec, index){
              return <MenuItem value={rec.id}>
	                      <Checkbox checked={formik.values.authorities.indexOf(rec.id) > -1} />
	                      <ListItemText primary={rec.name} />
              		 </MenuItem>;
              })}
          </Select>
         </FormControl>
       
       <Stack direction={{ xs: 'column', sm: 'row' }}  spacing={2}>
	        <LoadingButton
		       size="large"
		       variant="contained"
		       loading={isSubmitting}
		       onClick={goBackList}>
		       Cancel
		    </LoadingButton>
		    <LoadingButton
	            type="submit"
	            variant="contained"
	            disabled={!(formik.isValid && formik.dirty) }
	            loading={isSubmitting}>
	            Save
	          </LoadingButton>
	   </Stack>      
       </Stack>
         }
      </Form>
    </FormikProvider>
  );
}
