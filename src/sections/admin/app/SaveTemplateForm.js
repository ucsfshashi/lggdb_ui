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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styled from 'styled-components';
import configData from "../../../config.json";
import {useAuth} from '../../../hooks/authContext.js';
import TaskApp from '../dragndrop/task-app';



export default function SaveTemplateForm({goBackList,selTagInfo,selTemplateId}) {
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [templateInfo, setTemplateInfo] = useState(null);
  const [selRole, setSelRole] = useState(null);
  const [createResponse, setCreateResponse] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
	  const fetchData = async () => {
	      var url = loginContext.apiUrl+"/import/template/"+selTemplateId;
	   	 
          setLoading(true);

	      
		  const response = await axios.get(url, 
	                                {headers:{
	                                  'Content-Type' :'applicaiton/json',
	                                  'X-Requested-With':'XMLHttpRequest', 
	                                  'UCSFAUTH-TOKEN':loginContext.token,
	                                  'selRole':loginContext.selRole,
	                                  'tagId':selTagInfo.tagId
	                                }}
	                                ).catch((err) => {
	           if(err && err.response)
	              if(err.response.status != 200) 
	                  setError("Unable to load templated");
	        });
	  	  
	  	    if(response && response.data) {
	            setTemplateInfo(response.data);
	       
	            formik.setValues({
	                id:response.data.id,
	                name:response.data.name,
	                description:response.data.description
	              });
	            
	        }
	        setLoading(false);

      }
      fetchData();
      }, []);

  const RegisterSchema = Yup.object().shape({
	  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Template Name is required'),
      description: Yup.string().min(20, 'Too Short!').max(2000, 'Too Long!').required('Description is required'),
     
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
  
  
  const  handleTemplateChange = (tasks)  => {
      let template = {...templateInfo};
      template['spreadSheetVariables']=tasks;
      setTemplateInfo(templateInfo);
  }

  const formik = useFormik({
    initialValues: {
    	id: templateInfo?templateInfo.id:null,
    	name: templateInfo?templateInfo.name:'',
    	description: templateInfo?templateInfo.description:''
    },
    validationSchema: RegisterSchema,
    onSubmit:registrationSubmit,
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
    <FormikProvider value={formik} >
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        
      { !createResponse &&	
      <Stack spacing={3}  sx={{ 'paddingLeft':'100px','paddingTop':'50px','paddingBottom':'50px' }}  >
     
	       <Stack direction={{ xs: 'column', sm: 'row' }}  spacing={8}>
	       
	       <TextField
   		  sx={{ 'width':'450px' }} 
   		  label="Template Name"
   		  disabled={templateInfo!=null}	  
           {...getFieldProps('name')}
           error={Boolean(touched.tagName && errors.tagName)}
           helperText={touched.tagName && errors.tagName}
         />
   	    <TextField
         	sx={{ 'width':'700px' }} 
           label="Description"
           multiline
           minRows={1}	  
           {...getFieldProps('description')}
           error={Boolean(touched.description && errors.description)}
           helperText={touched.description && errors.description}
         />
           		<LoadingButton
		            type="submit"
		            variant="contained"
		            disabled={!(formik.isValid && formik.dirty) }
		            loading={isSubmitting}>
		            Save Template
		          </LoadingButton>
		         
		        <LoadingButton
		            type="submit"
		            variant="contained"
		            disabled={(formik.isValid || formik.dirty) }
		            loading={isSubmitting}>
		            Download Template
		        </LoadingButton>    
		            
		   </Stack>
		   
		   {templateInfo &&
				   <Stack>
						<TaskApp  schemaVariables={templateInfo.schemaVariables}  spreadSheetVariables={templateInfo.spreadSheetVariables} handleTemplateChange={handleTemplateChange} />
				   </Stack>
		   }		
		   
        </Stack>
         }
      </Form>
    </FormikProvider>
  );
}
