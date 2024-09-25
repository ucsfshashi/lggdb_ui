import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import styled from 'styled-components';
import configData from "../../../config.json";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import * as React from 'react';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SynonymSaveForm from './SynonymSaveForm';




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
import TableViewIcon from '@mui/icons-material/TableView';




// ----------------------------------------------------------------------


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: 12,
    border: '1px solid #dadde9',
  },
}));

export default function SynonymForm() {
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);    
  const [studyAction, setStudyAction] = useState("view");    
  const [selRepoInfo,setSelRepoInfo] = useState(null);
  
  


  
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
      
    	  
    	  var url = loginContext.apiUrl+"/synonymRepo/list";
    	 
    	 
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
    	  
    	  /*
    	  var data1=[];
    	  data1.push({"fieldName":"Gender","topicName":"Demographic","repositoryInfo":[{"key":"Male","val":"M"},{"key":"Boy","val":"M"}]})
    	  data1.push({"fieldName":"Race","topicName":"Demographic","repositoryInfo":[{"key":"W","val":"White"},{"key":"Black or African American","val":"Black"},{"key":"African","val":"Black"}]})
    	  data1.push({"fieldName":"Ethnicity","topicName":"Demographic","repositoryInfo":[{"key":"Alaska Native","val":"Native Indians"},{"key":"Asian Indian","val":"Asian"}]})
    	  setData(data1); 
    	  */
    	  
    	  setLoading(false);
         
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

        if(loginContext.selRole != 'STUDY_ADMIN') {
        	options.customToolbar= () => {
    	        return (
    	         <MUIAddButton onAddClick={(event)=>addOnClick(event,{})}    />
    	        );
    	      };
        }
          
	  return options;
   };
   
   
   const addOnClick=(e) => {
	   setStudyAction("add");
	   setSelRepoInfo(null);
	};
	
	const goBackList=(e) => {
		   setStudyAction("view");
		  
	};	
		
	const handleStudyClick=(tagId) => {
	
		
      setLoading(true);	
	  
      const fetchData = async () => {
	      var url = loginContext.apiUrl+"/studyTag/"+tagId;
	   	 
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
	            setSelRepoInfo(response.data);
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
					<Link size="small" color="primary" sx={{'cursor':'pointer'}} onClick={(event)=>handleStudyClick(tableMeta.rowData[5])} >
					   {value}
			        </Link>
	      );
		  };
		
	       columns.push({
	    	   name: 'fieldName',
	    	   label: 'Field Name',
	    	   options: {
	    		   filter: true,
	    		   sort: true
	    		  }
	    	});
	
	    	options.filter=false;
		    options.viewColumns=false;
	        columns[0].options = options;
	
	       
	       
	       
	        options = {};
	      
	       
		    options.filter=false;
		    options.viewColumns=false;	
		    options.sort=false;
		  
		  columns.push({
	    	   name: 'entityName',
	    	   label: 'Topic Name'
	    	});
		  
		  columns[1].options = options;
	    	
		  
		  options = {};
		   	
	   	    options.customBodyRender = (value, tableMeta, updateValue) => {
				return (
						<Link size="small" color="primary" sx={{'cursor':'pointer'}} onClick={(event)=>handleStudyClick(tableMeta.rowData[5])} >
						 <HtmlTooltip
					        title={
					          <React.Fragment>
					            <TableContainer component={Paper}>
      							<Table  aria-label="simple table">
        						<TableHead>
          							<TableRow>
          								<TableCell align="right">Key</TableCell>
            							<TableCell align="right">Value</TableCell>
          							</TableRow>
        						</TableHead>
        						 <TableBody>
        						 {value.map((row) => (
        						 
        						 <TableRow
              							key={row.name}
              							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        						  <TableCell align="right">{row.key}</TableCell>
              						<TableCell align="right">{row.val}</TableCell>
        						  </TableRow>
        						  
        						  ))}
        						  
        						 </TableBody>
        						 </Table>
    							</TableContainer>
        				      </React.Fragment>
					        }
					      >
						 <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/admin/app")}>
				            <TableViewIcon color="success" fontSize="inherit" />
				          </IconButton>   
				          </HtmlTooltip>
				        </Link>
		      );
			  };
			  
			  
	       columns.push({
	    	   name: 'keys',
	    	   label: 'Repository Information'
	    	   
	    	});
	       
	       columns[2].options = options;
	       
	       
	       return  columns;
   }
 
  return (
		 <Page title="Synonym Repository">
		  { 1==0 && 
			  <Stack > 
			  	<Box sx={{ pb: 5 }}>
		        <Stack direction="row" alignItems="center" spacing={0.5}>    
		          <Typography variant="h4">Synonym Repository</Typography>
		          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
		            <ResetTvIcon color="success" fontSize="inherit" />
		          </IconButton>    
		        </Stack>
		        </Box>
	          <Stack >    
	  		    <MUIDataTable
		            title="Synonym Repository"
		            options={getOptions()}
		            data={data}
		            columns={getColumns()} 
		            />
		         {loading && <LinearProgress />}
	  		  </Stack>
	  	    </Stack>	
	  	 }
	  	 
	  	 { 1==1 && 
	  			<Stack > 
			  	<Box sx={{ pb: 5 }}>
		        <Stack direction="row" alignItems="center" spacing={0.5}>    
		          <Typography variant="h4">Synonym Repository</Typography>
		          <IconButton aria-label="restart" size="medium"  onClick={() => goBackList()} >
		            <ResetTvIcon color="success" fontSize="inherit" />
		          </IconButton>    
		        </Stack>
		        </Box>
	          <Stack >    
	  		      <SynonymSaveForm goBackList={goBackList}  selRepoInfo={selRepoInfo} />
		         {loading && <LinearProgress />}
	  		  </Stack>
	  	    </Stack>	
      	 } 
	  	 </Page>
  );
}
