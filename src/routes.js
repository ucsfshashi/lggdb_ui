import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import PatientLayout from './layouts/patient';
import AdminLayout from './layouts/admin';

//
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import PwdChange from './pages/PwdChange';
import PostLogin from './pages/PostLogin';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import AdminApp from './pages/AdminApp';
import SynonymApp from './pages/SynonymApp';
import CleansingApp from './pages/CleansingApp';

import UsersApp from './pages/UsersApp';
import PatientApp from './pages/PatientApp';
import Query from './pages/Query';
import Upload from './pages/Upload';
import Search from './pages/Search';
import Patients from './pages/Patients';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'patients', element: <Patients /> },
        { path: 'query', element: <Query /> },
        { path: 'upload', element: <Upload /> },
		{ path: 'search', element: <Search /> }
      ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { path: 'app', element: <AdminApp /> },
          { path: 'users', element: <UsersApp /> },
          { path: 'synonym', element: <SynonymApp /> },
		  { path: 'cleansing', element: <CleansingApp /> }
		  
        ]
    },
    {
      path: '/goto',
      element: <PatientLayout/>,
      children: [
        { path: 'patient', element: <PatientApp /> },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'forgot', element: <Forgot /> },
        { path: 'pwdChange', element: <PwdChange /> },
        { path: 'postLogin', element: <PostLogin /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/407" replace /> }
  ]);
}
