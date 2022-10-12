import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import PatientLayout from './layouts/patient';
//
import Login from './pages/Login';
import PostLogin from './pages/PostLogin';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import PatientApp from './pages/PatientApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'patients', element: <User /> },
        { path: 'query', element: <Products /> },
        { path: 'upload', element: <Blog /> }
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
        { path: 'postLogin', element: <PostLogin /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/407" replace /> }
  ]);
}
