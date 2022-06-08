// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../sections/@dashboard/app';

import {useAuth} from '../hooks/authContext.js';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

export default function DashboardApp() {

  const {loginContext, setLoginContext} = useAuth();   
  const navigate = useNavigate();    
    
    
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>    
          <Typography variant="h4">{loginContext.selTag.tagName}</Typography>
          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
            <ResetTvIcon fontSize="inherit" />
          </IconButton>    
        </Stack>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
