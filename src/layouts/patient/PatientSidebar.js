import PropTypes from 'prop-types';
import { useEffect,useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mocks_
import account from '../../_mocks_/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import PatientNavSection from '../../components/PatientNavSection';
//
import {useAuth} from '../../hooks/authContext.js';
import Iconify from '../../components/Iconify';



// ----------------------------------------------------------------------
const DRAWER_WIDTH = 280;


const allowedTopics=['Demographics','Tumor','Surgery','Chemotherapy','Clinical Evaluation','Imaging','Radiotherapy',
	   'Medication','Clinical Trial','Epidemiology','Past Medical History','Diagnosis','Language','Loglio cognitive','Cognition','QAB','QOL','Attention','IPS',
	   'McGurk','Wakefulness','Sensory','Other Treatment'];

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


const fetchDistinctTopic = (array) => {
	   
	   const result = [];
	   const map = new Map();
	   for (const item of array) {
	       if(!map.has(item.topic)){
	           map.set(item.topic, true);    // set any value to Map
	           
	           if(allowedTopics.includes(item.topic) && item.id !='referenceEventDate') {
		           result.push({
		        	   topic:item.topic,
		        	   title:item.topic,
		        	   className:item.className,
		        	   icon: getIcon(item.icon),
		        	   path: '/goto/patient',
		               topicDisplayPriority: item.topicDisplayPriority
		           });
	           }
	       }
	   }
	  
	   // Sort topic to generate left menu
	   result.sort((a, b) => (a.topicDisplayPriority > b.topicDisplayPriority) ? 1 : -1);
	   
	   
	   return result;
   };

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12]
}));

const names = {
	    'PHI_ACCESS':'PHI access user',
	    'NON_PHI':'Non-PHI access user',
	    'ADMIN':'Administrator',
	    'STUDY_ADMIN':'Study coordinator' };



// ----------------------------------------------------------------------

PatientSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function PatientSidebar({ isOpenSidebar, onCloseSidebar,selTopic,setSelTopic }) {
  const { pathname } = useLocation();

  const {loginContext} = useAuth();
  const isDesktop = useResponsive('up', 'lg');
  const topicList = fetchDistinctTopic(loginContext.schema);
 
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  
   
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={'https://ui-avatars.com/api/?name='+loginContext.displayName} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
              {loginContext.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               {names[loginContext.selRole]}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <PatientNavSection navConfig={topicList} selTopic={selTopic} setSelTopic={setSelTopic} />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{ pt: 5, borderRadius: 2, position: 'relative' }}
        >
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed'
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
