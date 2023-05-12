import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import configData from "../../../config.json";

// material
import {
  AppBar,
  LinearProgress,
  Toolbar,
  Alert,
  Link,
  Stack,
  Checkbox,
  Button,
  TextField,
  Container,
  Paper,
  Box,
  IconButton,
  Typography,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import Page from '../../../components/Page';

import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import {useAuth} from '../../../hooks/authContext.js';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import MUIDataTable from "mui-datatables";
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import MUIAddButton from '../../../common/MUIAddButton';


// ----------------------------------------------------------------------

export default function Templates({selTagInfo,goBackList}) {
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);    
  const [isNewStudy, setIsNewStudy] = useState(false);    
  const [successMsg,setSuccessMsg] = useState(null);

   
  useEffect(() => {
      const fetchData = async () => {
      
    	  var url = loginContext.apiUrl+"/import/template/list/basics";
    	 
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
                    setError("Unable to load templates");
          });
    	  
    	  if(response && response.data) {
              setData(response.data);
              setLoading(false);
           }
         
      };
      fetchData();
      }, []);
  
  
  const handleTemplateClick=(data) => {
      setLoading(true);	
  }
  
  
  const handlRemoveClick=(data) => {
      setLoading(true);	
  }
  
  
  
  const getColumns= () =>{
	
	  var columns =[];
  	var options = {};
  	
  
  	
  	options.customBodyRender = (value, tableMeta, updateValue) => {
		return (
				<Link size="small" color="primary" sx={{'cursor':'pointer'}} onClick={(event)=>handleTemplateClick(data[tableMeta.rowIndex])} >
				   {value}
		        </Link>
      );
	};
  	
  	columns.push({
   	   name: 'name',
   	   label: 'Template name',
   	   options: {
   		   filter: true,
   		   sort: true
   		  }
	    });
  	
  	options.filter=false;
	    options.viewColumns=false;
      columns[0].options = options;
  	
  	
  	columns.push({
   	   name: 'description',
   	   label: 'Template description',
   	   options: {
   		   filter: true,
   		   sort: true
   		  }
	    });
  	
  	
  	
  	columns.push({
    	   name: 'id',
    	   label: 'Action',
    	   options: {
    		   filter: true,
    		   sort: true
    		  }
	    });
  	
  	
  	options = {};
  	
  	
  	options.customBodyRender = (value, tableMeta, updateValue) => {
			return (
					<Link size="small" color="primary" sx={{'cursor':'pointer'}} onClick={(event)=>handlRemoveClick(data[tableMeta.rowIndex])} >
						<DeleteForeverTwoToneIcon color="primary" fontSize="large" />
			        </Link>
				);
		};
  	
		options.filter=false;
	    options.viewColumns=false;
      columns[2].options = options;
  	    
  	return  columns;
  };
  
  const addOnClick=(e) => {
	 
  };
  
  const getOptions =() =>{
		var options = {};
		
		options.fixedHeader = true;
		options.print =false;
		options.pagination = false;
		options.responsive='scroll';
		options.selectableRows = 'none';
		options.filterType='multiselect';
        options.download=false;
        options.customToolbar= () => {
	        return (
	         <MUIAddButton onAddClick={(event)=>addOnClick(event,{})}    />
	        );
	      };
	  
	    return options;
 };
      
  return (
		  <Page title="Study templates">
	       <Stack > 
		  	<Box sx={{ pb: 5 }}>
	        <Stack direction="row" alignItems="center" spacing={0.5}>    
	          <Typography variant="h4">Studies :({selTagInfo.tagName})  </Typography>
	          <IconButton aria-label="restart" size="medium"  onClick={() => goBackList()}>
	            <ResetTvIcon color="success" fontSize="inherit" />
	          </IconButton>    
	        </Stack>
	        </Box>
	        
	        
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
    		
	        <Stack>
	        <MUIDataTable
	            title="Study templates"
	            options={getOptions()}
	            data={data}
	            columns={getColumns()} 
            />
	        {loading && <LinearProgress />}
	        </Stack>
	        </Stack>
    	   </Page>
  );
}
