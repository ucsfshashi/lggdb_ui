import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import styled from 'styled-components';
import configData from "../../../config.json";

// material
import {
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

// ----------------------------------------------------------------------

export default function AssignUsers({selTagInfo,goBackList}) {
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const {loginContext, setLoginContext} = useAuth();
  const [loading, setLoading] = useState(true); 
  const [data, setData] = useState([]);    
  const [isNewStudy, setIsNewStudy] = useState(false);    
  

  
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
      const fetchData = async () => {};
      fetchData();
      }, []);
   
      
  return (
		  <Page title="Studies">
	       <Stack > 
		  	<Box sx={{ pb: 5 }}>
	        <Stack direction="row" alignItems="center" spacing={0.5}>    
	          <Typography variant="h4">Studies : Assign users ({selTagInfo.tagName})  </Typography>
	          <IconButton aria-label="restart" size="medium"  onClick={() => goBackList()}>
	            <ResetTvIcon color="success" fontSize="inherit" />
	          </IconButton>    
	        </Stack>
	        </Box>
	        <Stack>
	        
	        
	           
	        </Stack>
	        </Stack>
    	   </Page>
  );
}
