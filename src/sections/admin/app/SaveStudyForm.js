import * as Yup from 'yup';
import { useState,useEffect,Fragment } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, Typography,
	Alert,
	AlertTitle,
	Checkbox,
	ListItemText,
	OutlinedInput,
	InputAdornment,FormControl,InputLabel,MenuItem,FormHelperText,TextareaAutosize } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styled from 'styled-components';
import configData from "../../../config.json";
import {useAuth} from '../../../hooks/authContext.js';


export default function SaveStudyForm({goBackList,selTagInfo}) {
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [lggdbUsers, setLggdbUsers] = useState(null);
  const [selRole, setSelRole] = useState(null);
  const [createResponse, setCreateResponse] = useState(null);
  const {loginContext, setLoginContext} = useAuth();

  useEffect(() => {
      const fetchData = async () => {
      
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
    			  lData =lData.filter(word => word.authorities.indexOf('STUDY_ADMIN') != -1);
        		  lData = lData.map((fieldOption) => {
	    			  	return {value: fieldOption.username, label: fieldOption.username};
	  		    	});
    		  }
    		  setLggdbUsers(lData);
           }
      };
      fetchData();
      }, []);

    
  const RegisterSchema = Yup.object().shape({
	  tagName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('StudyName is required'),
      description: Yup.string().min(20, 'Too Short!').max(2000, 'Too Long!').required('Description is required'),
      irbInfo: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('IRB is required'),
      pointOfContact: Yup.string().min(5, 'Too Short!').max(100, 'Too Long!').required('Point of Contact is required'),
      principalInvestigator: Yup.string().min(5, 'Too Short!').max(100, 'Too Long!').required('Principal Investigator')
  });
  
  const registrationSubmit = async (values) => {
      
	  const headers = { 
   		   'Content-Type' :'application/json',
           'X-Requested-With':'XMLHttpRequest',
           'UCSFAUTH-TOKEN':loginContext.token
   	  };
	  
	  var data=values;

	  setLoginContext({apiUrl:configData.apiUrl})
	  
	  var rInfo=await axios.post(configData.apiUrl+"/studyTag/save", 
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
    	tagId: selTagInfo?selTagInfo.tagId:null,
    	tagName: selTagInfo?selTagInfo.tagName:'',
    	description: selTagInfo?selTagInfo.description:'',
    	irbInfo: selTagInfo?selTagInfo.irbInfo:'',
    	principalInvestigator: selTagInfo?selTagInfo.principalInvestigator:'',
    	pointOfContact: selTagInfo?selTagInfo.pointOfContact:'',
    	adminUsers: selTagInfo?selTagInfo.adminUsers:[],
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
      		  label="Study Name"
      		  disabled={selTagInfo!=null}	  
              {...getFieldProps('tagName')}
              error={Boolean(touched.tagName && errors.tagName)}
              helperText={touched.tagName && errors.tagName}
            />
      	    <TextField
            	sx={{ 'width':'600px' }} 
              label="Description"
              multiline
              minRows={4}	  
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
           <TextField
            sx={{ 'width':'400px' }} 
            label="IRB Information"
            {...getFieldProps('irbInfo')}
            error={Boolean(touched.irbInfo && errors.irbInfo)}
            helperText={touched.irbInfo && errors.irbInfo}
          />   
      <Stack direction={{ xs: 'column', sm: 'row' }}  spacing={2}>
 
          <TextField
          sx={{ 'width':'400px' }} 
          label="Principal Investigator"
          {...getFieldProps('principalInvestigator')}
          error={Boolean(touched.principalInvestigator && errors.principalInvestigator)}
          helperText={touched.principalInvestigator && errors.principalInvestigator}
          />   
          
          
          <TextField
          sx={{ 'width':'400px' }} 
          label="Point of Contact"
          {...getFieldProps('pointOfContact')}
          error={Boolean(touched.pointOfContact && errors.pointOfContact)}
          helperText={touched.pointOfContact && errors.pointOfContact}
          />   
      </Stack>   
          <FormControl sx={{ m: 1, minWidth: 120 }} >
          <InputLabel id="demo-select-role">Study Coordinators</InputLabel>
          <Select
            multiple
            sx={{ 'width':'825px' }} 
            labelId="demo-select-role"
            id="demo-select-role"
            {...getFieldProps('adminUsers')}
            label="Study Coordinators"
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}	
           >
          {lggdbUsers && lggdbUsers.map(function(rec, index){
              return <MenuItem value={rec.value}>
	                      <Checkbox checked={formik.values.adminUsers.indexOf(rec.value) > -1} />
	                      <ListItemText primary={rec.label} />
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
