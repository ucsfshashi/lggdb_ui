import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import {useAuth} from '../../hooks/authContext.js';


// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
	  display: 'flex',
	  minHeight: '100%',
	  overflow: 'hidden'
	});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [selTopic, setSelTopic] = useState('Demographics');
  const {loginContext} = useAuth();
  

  return (
    <RootStyle>
      <AdminNavbar onOpenSidebar={() => setOpen(true)} selTopic={selTopic} setSelTopic={setSelTopic}  />
      <AdminSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} selTopic={selTopic} setSelTopic={setSelTopic} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
