import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button,Box, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
//
import POSTS from '../_mocks_/blog';

import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import {useAuth} from '../hooks/authContext.js';

export default function Blog() {

 const {loginContext} = useAuth();
 const navigate = useNavigate();    
    
    
  return (
    <Page title="Upload">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>    
          <Typography variant="h4">{loginContext.selTag.tagName}</Typography>
          <IconButton aria-label="restart" size="medium"  onClick={() => navigate("/postLogin")}>
            <ResetTvIcon fontSize="inherit" />
          </IconButton>    
        </Stack>
        </Box>
      </Container>
    </Page>
  );
}
