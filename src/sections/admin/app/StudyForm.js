import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import styled from 'styled-components';
import configData from "../../../config.json";
import StudyChildMenu from './StudyChildMenu';


// material
import {
  Alert,
  AlertTitle,
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
import MUIAddButton from '../../../common/MUIAddButton';
import SaveStudyForm from './SaveStudyForm';
import DefineDataTypes from './DefineDataTypes';



// ----------------------------------------------------------------------

export default function StudyForm() {
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);    
  const [studyAction, setStudyAction] = useState("view");    
  const [selTagInfo,setSelTagInfo] = useState(null);


  
  const DescriptionText = styled.div`
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family:Helvetica Light;
  font-size: 1.25em;
  `;

  const ParagraphDiv = styled.p`
  position: absolute;
  cursor: pointer;
  font-family: Helvetica Light;
  font-size: 1.5rem;
  letter-spacing: 0.03em;
  `;
  
  
  const AnchorTemplateName = styled.a`
  cursor: pointer;
  font-family: Helvetica Light;
  font-size: 1.5rem;
  `;
  
  
  useEffect(() => {
      const fetchData = async () => {
      
    	  var url = loginContext.apiUrl+"/studyTag/list";
    	 
    	  if(loginContext.selRole == 'STUDY_ADMIN') {
    		  url = loginContext.apiUrl+"/studyTag/saList";
    	  }
   
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

        options.customToolbar= () => {
	        return (
	         <MUIAddButton onAddClick={(event)=>addOnClick(event,{})}    />
	        );
	      };
	  return options;
   };
   
   
   const addOnClick=(e) => {
	   setStudyAction("edit");
	   setSelTagInfo(null);
	};
	
	const goBackList=(e) => {
		   setStudyAction("view");
		  
	};	
		
	const handleStudyClick=(data) => {
	
		
      setLoading(true);	
	  
      const fetchData = async () => {
	      var url = loginContext.apiUrl+"/studyTag/"+data.tagId;
	   	 
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
	            setSelTagInfo(response.data);
	            setStudyAction("edit");
	            setLoading(false);
	        }
      }
      
      fetchData();
      
	}	
   
   const getColumns = () => {
	   var columns =[];
   	var options = {};
   	
   	options.customBodyRender = (value, tableMeta, updateValue) => {
			return (
					<Link size="small" color="primary" sx={{'cursor':'pointer'}} onClick={(event)=>handleStudyClick(data[tableMeta.rowIndex])} >
					   {value}
			        </Link>
	      );
		};
		
	       columns.push({
	    	   name: 'tagName',
	    	   label: 'Name',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
	
	    	options.filter=false;
		    options.viewColumns=false;
	        columns[0].options = options;
	
	       
	       
	       
	       options = {};
	       options.customBodyRender = (value, tableMeta, updateValue) => {
				return (
					<DescriptionText>
				    	   {data[tableMeta.rowIndex].description}
				    </DescriptionText>
			);
			};
	       
		  options.filter=false;
		  options.viewColumns=false;	
		  options.sort=false;
		  
		  columns.push({
	    	   name: 'description',
	    	   label: 'Description'
	    	});
		  
		  columns[1].options = options;
	    	
	       columns.push({
	    	   name: 'irbInfo',
	    	   label: 'IRB Information',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
	       
	       columns.push({
	    	   name: 'principalInvestigator',
	    	   label: 'Principal Investigator',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
	    	
	    	
	       columns.push({
	    	   name: 'pointOfContact',
	    	   label: 'Point of Contact',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
	       
	      
	       options = {};
	       options.customBodyRender = (value, tableMeta, updateValue) => {
				return (
					<StudyChildMenu  config={loginContext} loginContext={loginContext} setSelTagInfo={setSelTagInfo} setStudyAction={setStudyAction} tag={data[tableMeta.rowIndex]} />
	           );
			};
	       
		  options.filter=false;
		  options.viewColumns=false;
		  options.sort=false;
	       columns.push({
	    	   name: 'id',
	    	   label: 'Actions'
	    	});
	       
	       columns[5].options = options;
	       
	       
	       
	       options = {};
	       options.customBodyRender = (value, tableMeta, updateValue) => {
				return (
						<ParagraphDiv>
				    	   {data[tableMeta.rowIndex].noOfPatients<9?"000"+data[tableMeta.rowIndex].noOfPatients:(data[tableMeta.rowIndex].noOfPatients<99?"00"+data[tableMeta.rowIndex].noOfPatients:data[tableMeta.rowIndex].noOfPatients)}
				    	</ParagraphDiv>
			);
			};
	       
	       
	       columns.push({
	    	   name: 'noOfPatients',
	    	   label: '#Patients',
	    	   options: {
	    		   filter: true,
	    		   sort: false
	    		  }
	    	});
	       
	       columns[6].options = options;
	       
	       return  columns;
   }
 
  return (
		  <Page title="Studies">
	        
		   { studyAction == "view" && 
			   <Stack > 
			  	<Box sx={{ pb: 5 }}>
		        <Stack direction="row" alignItems="center" spacing={0.5}>    
		          <Typography variant="h4">Studies</Typography>
		          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
		            <ResetTvIcon color="success" fontSize="inherit" />
		          </IconButton>    
		        </Stack>
		        </Box>
	            <Stack >    
	    		<MUIDataTable
		            title="Studies"
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
		          <Typography variant="h4">Studies</Typography>
		          <IconButton aria-label="restart" size="medium"  onClick={() => goBackList()}>
		            <ResetTvIcon color="success" fontSize="inherit" />
		          </IconButton>    
		        </Stack>
		        </Box>
    			<Paper>
    			<SaveStudyForm goBackList={goBackList}  selTagInfo={selTagInfo} />
    			</Paper>	
    	    </Stack>
    	   }
    	   { studyAction == "dataTypes" && 	
    	      <DefineDataTypes goBackList={goBackList} selTagInfo={selTagInfo}  />
    	   }
    	   </Page>
  );
}
