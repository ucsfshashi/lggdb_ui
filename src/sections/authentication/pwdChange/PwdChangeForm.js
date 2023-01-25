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
  FormControlLabel,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import {useAuth} from '../../../hooks/authContext.js';

// ----------------------------------------------------------------------

export default function PwdChangeForm() {
  const navigate = useNavigate();
  const [error,setError] = useState(null);
  const [success,setSuccess] = useState(false);
  const {loginContext, setLoginContext} = useAuth();


  useEffect(() => {
      //resetting login context  
      localStorage.clear();   
  }, []);
    
    
 const ErrorTitle = styled.span`
  font-size: 14px;
  color:red;
`;


  const PwdChangeSchema = Yup.object().shape({
    password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Old password is required'),
    newPassword: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('New password is required')
  });

  const PwdChangeSubmit = async (values) => {
     const res = await axios.post("https://btcdb-test.ucsf.edu/api/auth/reset", {"username":loginContext.username,"password":values.password,"newPassword":values.newPassword}).catch((err) => {
       if(err && err.response)
          if(err.response.status != 200) 
              setError("Unable to change passwword.");
     });

     if(res && res.status == 200) {
          localStorage.clear();
          setSuccess(true);
          navigate('/login');
     }
  }  

 const formik = useFormik({
    initialValues: {
      email:loginContext.username,
      password:'',
      newPassword:''
    },
    validationSchema: PwdChangeSchema,
    onSubmit:PwdChangeSubmit,
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
       
        
        <Typography variant="string" component="h3" sx={{ color: 'green' }}>
           {loginContext.username}
         </Typography>
        
        <TextField
        fullWidth
        autoComplete="password"
        type="password"
        label="Old password"
        {...getFieldProps('password')}
        error={Boolean(touched.password && errors.password)}
        helperText={touched.password && errors.password}
        />
        <TextField
        fullWidth
        autoComplete="newPassword"
        type="password"
        label="New password"
        {...getFieldProps('newPassword')}
        error={Boolean(touched.newPassword && errors.newPassword)}
        helperText={touched.newPassword && errors.newPassword}
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
           Change password
        </LoadingButton>
        </Stack>   
       }
       { success &&
          <Alert severity="info"     variant="none"  >
    	<AlertTitle> Restore password</AlertTitle>
    	Detail instructions has been sent to your email to reset your password.   
    	<br/>
    	You may need to check your spam folder or unblock no-reply@btcd.com
    	<br/><br/>
    	<b> Still have an issue? <a href="mailto: BTCDB-Support@ucsf.edu "> Please contact administrator.</a> </b>
	 </Alert> 
       
       
       }
      </Form>
    </FormikProvider>
  );
}
