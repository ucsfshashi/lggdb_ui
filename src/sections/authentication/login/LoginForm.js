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
  Checkbox,
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

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error,setError] = useState(null);
  const [forbidden,setForbidden] = useState(false);

  const {loginContext, setLoginContext} = useAuth();

  useEffect(() => {
      //resetting login context  
      localStorage.clear();   
  }, []);
    
    
 const ErrorTitle = styled.span`
  font-size: 14px;
  color:red;
`;


  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const LoginSubmit = async (values) => {
     const res = await axios.post("https://btcdb-test.ucsf.edu/api/auth", {"username":values.email,"password":values.password}).catch((err) => {
       if(err && err.response)
          if(err.response.status != 200) {
              if(err.response.status == 412){
            	  setLoginContext({username:values.email})
                  navigate('/pwdChange');
              }else if(err.response.status == 403){
            	  setForbidden(true);
              }else {
            	  setError("User name or Password is invalid");
              }
          }
     });

     if(res && res.status == 200) {
          localStorage.clear();
          setLoginContext({token:res.data.token})
          navigate('/postLogin');
     }
  }  

 const formik = useFormik({
    initialValues: {
      email:'',
      password:'',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit:LoginSubmit,
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
      
      { forbidden == false && 
    	<Stack spacing={3}>
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

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="/forgot" underline="hover">
            Forgot password?
          </Link>
        </Stack>
        
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
       </Stack>  } { forbidden == true && 
        	  
        	  <Stack spacing={3}>
        	  <Alert severity="error" variant="none"  >
              	<AlertTitle> BTCDB account is locked</AlertTitle>
                BTCDB account locked now.       
              	<br/>
              	If you created account recently and didn't received confirmation please wait for 5 business days. 
              	<br/><br/>
              	<b> Account already approved still have issue ? <a href="mailto: shashidhar.gajula@ucsf.edu "> Please contact administrator.</a> </b>
     		 </Alert>   
          	</Stack>
         }
          
      </Form>
    </FormikProvider>
  );
}
