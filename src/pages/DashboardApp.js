// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  DemographicCount,
  SurgeryAccumlation,
  DemographicAge,
  StudyCountsChart
} from '../sections/@dashboard/app';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import { useNavigate } from "react-router-dom";
import {useAuth} from '../hooks/authContext.js';
import React, { useEffect, useState } from 'react';



// ----------------------------------------------------------------------

export default function DashboardApp() {

  const {loginContext } = useAuth();   
  const navigate = useNavigate();    
    
    
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>    
          <Typography variant="h4">{loginContext.selTag.tagName}</Typography>
          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
            <ResetTvIcon color="success" fontSize="inherit" />
          </IconButton>    
        </Stack>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <SurgeryAccumlation loginContext={loginContext} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <DemographicCount loginContext={loginContext} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <StudyCountsChart loginContext={loginContext} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <DemographicAge loginContext={loginContext} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
