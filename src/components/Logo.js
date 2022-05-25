import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <RouterLink to="/">
      <Box component="img" src="https://braintumorcenter.ucsf.edu/themes/custom/btc_main/logo.svg" sx={{ width: 180, height: 50, ...sx }} />
    </RouterLink>
  );
}
