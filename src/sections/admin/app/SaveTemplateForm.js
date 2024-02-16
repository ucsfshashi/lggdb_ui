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
import { createRef } from 'react';
// component
import Select, { SelectChangeEvent } from '@mui/material/Select';
import axios from "axios";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styled from 'styled-components';
import configData from "../../../config.json";
import {useAuth} from '../../../hooks/authContext.js';
import TaskApp from '../dragndrop/task-app';
import SaveIcon from '@mui/icons-material/Save';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function SaveTemplateForm({goBackList,selTagInfo,selTemplateId}) {
  
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [templateInfo, setTemplateInfo] = useState(null);
  const [selRole, setSelRole] = useState(null);
  const [createResponse, setCreateResponse] = useState(null);
  const [lselTemplateId,setLselTemplateId] = useState(selTemplateId);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 
  const [enableDownload, setEnableDownload] = useState(true); 
   const refOne=  createRef();


  useEffect(() => {
	  fetchData(lselTemplateId);
      }, []);

  const RegisterSchema = Yup.object().shape({
	  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Template Name is required'),
      description: Yup.string().min(20, 'Too Short!').max(2000, 'Too Long!').required('Description is required'),
     
  });
 
 
  
  const exportCSV = () => {
      axios.get(
    		  loginContext.apiUrl+"/import/template/sample/"+lselTemplateId,
              {headers:{
                  'X-Requested-With':'XMLHttpRequest', 
                  'UCSFAUTH-TOKEN':loginContext.token,
                  'selRole':loginContext.selRole
                }}
      ).then(response => {
          let blob = new Blob([response.data], {type: 'application/octet-stream'})
          let ref = refOne;
          ref.current.href = URL.createObjectURL(blob)
          ref.current.download = templateInfo.name+'.csv';
          ref.current.click()
      })
  }
  
  
  const fetchData = async (lTemplateId) => {
	  
	  var url = loginContext.apiUrl+"/import/template/"+lTemplateId;
   	 
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
  
  const registrationSubmit = async (values) => {
      
	  const headers = { 
   		   'Content-Type' :'application/json',
           'X-Requested-With':'XMLHttpRequest',
           'UCSFAUTH-TOKEN':loginContext.token,
           'tagId':selTagInfo.tagId
   	  };
	 
	  var data={};
	  
	  data['id'] = values.id;
	  data['description'] = values.description;
	  data['name'] = values.name;
	  data['spreadSheetVariables'] = templateInfo.spreadSheetVariables;
	  

	  var url = loginContext.apiUrl+"/import/template";
	  
	  var rInfo=await axios.post(url, 
			  JSON.stringify(data), { headers }).catch((err) => {
					if(err && err.response)
						if(err.response.status != 200) 
						setError("Error while fetching taglist");
						});    
	  
	  if(rInfo.status==208) {
		  setCreateResponse("ALREADY_EXIST");
	  } else if(rInfo.status==200) {
		  setCreateResponse("SUCCESS");
		  setLselTemplateId(rInfo.data.id);
		  fetchData(rInfo.data.id);
		  setEnableDownload(true);
	  }
  };
  
  const  handleTemplateChange = (tasks)  => {
      let template = {...templateInfo};
      setEnableDownload(false);
      template['spreadSheetVariables']=tasks;
      setTemplateInfo(template);
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
        
      { <Stack spacing={3}  sx={{ 'paddingLeft':'50px','paddingTop':'20px','paddingBottom':'50px' }}  >
     
	       <Stack direction={{ xs: 'column', sm: 'row' }}  spacing={8}>
	       
	       <TextField 
   		  label="Template Name"
   		  disabled={templateInfo && templateInfo.id!=null}	  
           {...getFieldProps('name')}
           error={Boolean(touched.tagName && errors.tagName)}
           helperText={touched.tagName && errors.tagName}
           inputProps={{style: {fontSize: '1.5rem','width':'500px'}}} // font size of input text
           InputLabelProps={{style: {fontSize: '1.5rem',color:'black',fontWeight:'bold'}}} // font size of input label	   
         />
   	    
        <TextField
           label="Description"
           multiline
           minRows={1}	  
           {...getFieldProps('description')}
           error={Boolean(touched.description && errors.description)}
           helperText={touched.description && errors.description}
           inputProps={{style: {fontSize: '1.5rem','width':'800px'}}} // font size of input text
           InputLabelProps={{style: {fontSize: '1.5rem',color:'black',fontWeight:'bold'}}} // font size of input label	
         />
          
           <Stack direction={{ xs: 'column', sm: 'row' }}  spacing={1}>
           <div>
           <LoadingButton
		            type="submit"
		            variant="contained"
		            disabled={!(formik.isValid && formik.dirty) }
		            loading={isSubmitting}>
           			<SaveIcon fontSize="large" />  <Typography variant="h5" >{" Save"}</Typography>
		    </LoadingButton>
		   </div>
		   <div>
	        <LoadingButton
	            variant="contained"
	            disabled={!(enableDownload)}	
	            onClick={() => exportCSV()}
	            loading={isSubmitting}>
	            <CloudDownloadIcon fontSize="large" /><Typography variant="h5">{" Download"}</Typography>
	        </LoadingButton>  
            <a style={{display: 'none'}} href='empty' ref={refOne}>ref</a>

	     </div>  
	     </Stack>    
		            
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
