import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import styled from 'styled-components';
import configData from "../../../config.json";


// material
import {
  Alert,
  AlertTitle,
  Link,
  Stack,
  Checkbox,
  TextField,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Paper,
  IconButton,
  Typography,
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
import MUIDataTable from "mui-datatables";
import MUIAddButton from '../../../common/MUIAddButton'
import SaveUserForm from './SaveUserForm';





// ----------------------------------------------------------------------

export default function UsersForm() {
  
	
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);    
  const [studyAction, setStudyAction] = useState("view");    
  const [selUserInfo, setSelUserInfo] = useState(null);    



  useEffect(() => {
      const fetchData = async () => {
      
    	  var url = loginContext.apiUrl+"/lggdbUser/list";
    	 
    	  const response = await axios.get(url, 
                                  {headers:{
                                    'Content-Type' :'applicaiton/json',
                                    'X-Requested-With':'XMLHttpRequest', 
                                    'UCSFAUTH-TOKEN':loginContext.token,
                                    'selRole':loginContext.selRole,
                                  }}
                                  ).catch((err) => {
             if(err && err.response)
                if(err.response.status != 200) 
                    setError("Unable to load studies");
          });
    	  
    	  if(response && response.data) {
              setData(response.data);
              setLoading(false);
           }
         
      };
      fetchData();
      }, []);
  
  
  const getOptions =() =>{
		var options = {};
		
		options.fixedHeader = true;
		options.print =false;
		options.pagination = false;
		options.responsive='scroll';
		options.selectableRows = 'none';
		options.filterType='multiselect';
        options.download=false;
	  
        return options;
   };
   
   const handleStudyClick=(data) => {
	   setSelUserInfo(data);
	   setStudyAction("edit");
   };
   
   const getColumns = () => {
		var columns = [];
		var options = {};
		
		options.customBodyRender = (value, tableMeta, updateValue) => {
			return (
					<Link size="small" color="primary" sx={{'cursor':'pointer'}} onClick={(event)=>handleStudyClick(data[tableMeta.rowIndex])} >
					   {value}
			        </Link>
	      );
		};
		
		
		
		
		 columns.push({
	    	   name: 'username',
	    	   label: 'User Name',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
		 
 
		 options.filter=false;
		 options.viewColumns=false;
		 columns[0].options = options;
		 
		 
		 columns.push({
	    	   name: 'firstName',
	    	   label: 'First Name',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
		 
		 columns.push({
	    	   name: 'lastName',
	    	   label: 'Last Name',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
		 
		 
		 columns.push({
	    	   name: 'enabled',
	    	   label: 'Status',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
		 
		 options = {};
			
			options.customBodyRender = (value, tableMeta, updateValue) => {
				return (
						<ToggleButtonGroup
				          color="primary"
				          value={value}
			              exclusive
				          aria-label="Platform">
				          <ToggleButton disabled={true} value="Yes" selected={value =='Yes'} >Enable</ToggleButton>
				          <ToggleButton disabled={true} value="No" selected={value =='No'} >Disable</ToggleButton>
				        </ToggleButtonGroup>
		      );
			};
		columns[3].options = options;	
		 
		 columns.push({
	    	   name: 'lastPasswordReset',
	    	   label: 'Last PasswordReset',
	    	   options: {
	    		   filter: false,
	    		   sort: false
	    		  }
	    	});
		 
		 columns.push({
	    	   name: 'lastLocked',
	    	   label: 'Last Locked',
	    	   options: {
	    		   filter: false,
	    		   sort: false
	    		  }
	    	});
		
		return columns;
   }
   
	const goBackList=(e) => {
		   setStudyAction("view");
	};	
 
  return (
		 <Page title="Users">
	        
	      
	        { studyAction == "view" && 
	         <Stack>
	        	<Box sx={{ pb: 5 }}>
	        		<Stack direction="row" alignItems="center" spacing={0.5}>    
	        			<Typography variant="h4">Users</Typography>
	        			<IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
	        				<ResetTvIcon color="success" fontSize="inherit" />
	        			</IconButton>    
	        		</Stack>
	        	</Box>
		        <Stack >    
		    		<MUIDataTable
			            title="Users"
			            options={getOptions()}
			            data={data}
			            columns={getColumns()} 
			            />
			        {loading && <LinearProgress />}
	    		</Stack>
	    	 </Stack>	
	        }
	        
	        { studyAction == "edit" && 
	        	 <Stack>
        	<Box sx={{ pb: 5 }}>
        		<Stack direction="row" alignItems="center" spacing={0.5}>    
        			<Typography variant="h4">Users</Typography>
        			<IconButton aria-label="restart" size="medium"  onClick={() => goBackList()}>
        				<ResetTvIcon color="success" fontSize="inherit" />
        			</IconButton>    
        		</Stack>
        	</Box>
	        	<Paper>
    				<SaveUserForm goBackList={goBackList}  selUserInfo={selUserInfo} />
    			</Paper>
    				</Stack>			
	        }
    	 </Page>
  );
}
