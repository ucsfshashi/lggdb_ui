import { useState,useEffect } from 'react';
import MUIDataTable from "mui-datatables";

import axios from "axios";

// material
import { Container, 
		Paper,
         Box,
         Stack, 
         Typography,LinearProgress } from '@mui/material';

// components
import Page from '../components/Page';
import {useAuth} from '../hooks/authContext.js';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';


import MyTagChooser from './MyTagChooser.js'



 
 


// ----------------------------------------------------------------------
export default function Search() {
  	
	
  const [filterTxt, setFilterTxt] = useState(null);
  const {loginContext} = useAuth();
  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState([]);  
  const [error, setError] = useState(null);  
  
 
 
    
 const navigate = useNavigate();        
    
  useEffect(() => {
        const fetchData = async () => {
          
        };
        fetchData();
        }, []);  
		
		
	const handleButtonClick = async() => {
	   		
			
		var mrns =  filterTxt ? filterTxt.split(',') : [];
		 
		  if(mrns && mrns.length >0) {
			
			
		      setLoading(true);
					
					
			  var url = loginContext.apiUrl+"/studyTag/filter";
				
					  
			  const response = await axios.post(url,JSON.stringify(mrns), 
	                                  {headers:{
										'Accept': 'application/json',
	                                    'Content-Type' :'application/json',
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
				  //localStorage.setItem("upset_data", JSON.stringify(response.data));
	              setData(response.data.upsertInfo);
				  setLoading(false);
		       }
		   }
			
			
	  };
 
 
 
	 const handleInputChange = (event) => {
	     setFilterTxt(event.target.value);
	   };  
	   
	   
	   
	   const getOptions =() =>{
	   	  		var options = {};
	   	  	
	   		  	options.fixedHeader = true;
	   		  	options.print =false;
	   		  	options.pagination = false;
	   		  	options.responsive='scroll';
				options.selectableRows=false;
	   		  	//options.selectableRows = 'multiple';
	   		  	//options.filterType='multiselect';
	   		    options.download=false;
	   		
	   			
	   	        return options;
	   	    };
	   
	   
	   const getColumns = () => {
	   				var columns = [];
	   				var options = {};
	   				
	   				
	   				
	   				columns.push({
	   				    	   name: 'name',
	   				    	   label: 'MRN',
	   				    	   options: {
	   				    		   filter: true,
	   				    		   sort: true
	   				    		  }
	   				    	});
	   					 

	   				 options.filter=false;
	   				 options.viewColumns=false;
	   				 columns[0].options = options;
	   				 
	   				 
	   				 columns.push({
	    				    	   name: 'sets',
	    				    	   label: 'Studies',
	    				    	   options: {
	    				    		   filter: true,
	    				    		   sort: true
	    				    		  }
	    				    	});
	   						
	   						
	   						options = {};
	   							
	   							options.customBodyRender = (value, tableMeta, updateValue) => {
	   								
	   								return <MyTagChooser mrn={tableMeta.rowData[1]} value={value}   />							
	   															
	   							};
	   					columns[1].options = options;			
	   			
	   				 return columns;
	   			};
 
    
  return (
    <Page title="Query">
     <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>    
          <Typography variant="h4">{loginContext.selTag.tagName}</Typography>
          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
            <ResetTvIcon color="success" fontSize="inherit" />
          </IconButton>    
        </Stack>
        </Box>
		
			<Paper
			      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '1200' }}
			    >
		     <InputBase
		       sx={{ ml: 1, flex: 1, width:'1200px' }}
			   InputBase='primary'
			   fullWidth='true'
			   margin='dense'
			   multiline='true'
			   value={filterTxt}
			   onChange={handleInputChange}
		       placeholder=" Enter MRN(s) separated by commas to conduct a search."
		       inputProps={{ 'aria-label': 'Enter MRN(s) separated by commas to conduct a search.' }}
		     />
		     <IconButton type="button"  disabled={loading} color='primary'  sx={{ p: '10px' }} aria-label="search" onClick={handleButtonClick} >
			 
		       <SearchIcon />
		     </IconButton>
			 </Paper>
		       { loading === true && 
		 		   			   
		 			<Box sx={{ width: '100%' }}>
		 			     <LinearProgress />
		 			   </Box>
		 		}
								    		
					<MUIDataTable
			            title={"Patients  "}
						sx={{ marginTop: '25px', width: '1200' }}
			            options={getOptions()}
			            data={data}
			            columns={getColumns()} 
					 />	
					
		
      </Container>            
    </Page>
  );
}
