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
 
 


// ----------------------------------------------------------------------
export default function Search() {
  	
	
  const [filterTxt, setFilterTxt] = useState([]);
  const {loginContext} = useAuth();
  const [loading, setLoading] = useState(false);  
  const [data, setData] = useState(null);  
  const [error, setError] = useState(null);  
  
 
 
    
 const navigate = useNavigate();        
    
  useEffect(() => {
        const fetchData = async () => {
          
        };
        fetchData();
        }, []);  
		
		
	const handleButtonClick = async() => {
	   		console.log(filterTxt);
			setLoading(true);
			
			
	      var url = loginContext.apiUrl+"/studyTag/summary";
	    	
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
			  //localStorage.setItem("upset_data", JSON.stringify(response.data));
              setData(response.data);
			  setLoading(false);
	       }
			
			
	  };
 
 
 
	 const handleInputChange = (event) => {
	     setFilterTxt(event.target.value);
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
		<Stack alignItems="center" spacing={0.5}>  
			<Paper
			      component="form"
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
		</Stack>
      </Container>            
    </Page>
  );
}
