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
import MUIAddButton from '../../../common/MUIAddButton'




// ----------------------------------------------------------------------

export default function UsersForm() {
  
	
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);    
  const [isNewStudy, setIsNewStudy] = useState(false);    


  
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
	   setIsNewStudy(true);
	};
   
   const getColumns = () => {
		var columns = [];
		
		return columns;
   }
 
  return (
		  <Page title="Users">
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
	            title="Users"
	            options={getOptions()}
	            data={data}
	            columns={getColumns()} 
	            />
	        {loading && <LinearProgress />}
    		</Stack>
	       </Page>
  );
}
