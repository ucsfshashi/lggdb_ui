import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from "axios";
import styled from 'styled-components';

// material
import {
  Alert,
  AlertTitle,
  Link,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import {useAuth} from '../../../hooks/authContext.js';

// ----------------------------------------------------------------------

export default function ForgotForm() {
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const [success,setSuccess] = useState(false);


  useEffect(() => {
      //resetting login context  
      localStorage.clear();   
  }, []);
    
    
 const ErrorTitle = styled.span`
  font-size: 14px;
  color:red;
`;


  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const ForgotSubmit = async (values) => {
     const res = await axios.post("https://btcdb-test.ucsf.edu/api/auth/restore", {"username":values.email,"password":null,"newPassword":null}).catch((err) => {
       if(err && err.response)
          if(err.response.status != 200) 
              setError("User name is invalid.");
     });

     if(res && res.status == 200) {
          localStorage.clear();
          setSuccess(true);
     }
  }  

 const formik = useFormik({
    initialValues: {
      email:''
    },
    validationSchema: LoginSchema,
    onSubmit:ForgotSubmit,
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        
       { !success &&
       <Stack spacing={3}>
        { error &&
        <ErrorTitle>
            {error}
        </ErrorTitle>
        }
        <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="User name"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        
        <br/>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!(formik.isValid && formik.dirty)}	  
          loading={isSubmitting}
        >
           Reset password
        </LoadingButton>
        </Stack>   
       }
       { success &&
          <Alert severity="info"     variant="none"  >
    	<AlertTitle> Restore password</AlertTitle>
    	Detailed instructions have been sent to your email to reset your password.   
    	<br/>
    	You may need to check your spam folder or unblock BTCDB-Support@ucsf.edu
    	<br/><br/>
    	<b> Still have an issue? <a href="mailto: BTCDB-Support@ucsf.edu "> Please contact the BTCDB team.</a> </b>
	 </Alert> 
       
       
       }
      </Form>
    </FormikProvider>
  );
}
