import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material';
//
import Iconify from './Iconify';
import {useAuth} from '../hooks/authContext.js';


// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: 'relative',
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2.5),
    color: theme.palette.text.secondary,
    '&:before': {
      top: 0,
      right: 0,
      width: 3,
      bottom: 0,
      content: "''",
      display: 'none',
      position: 'absolute',
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: theme.palette.primary.main
    }
  })
);

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
  active: PropTypes.func
};

function NavItem({ item, active,selTopic,setSelTopic }) {
  const theme = useTheme();
  const { title,topic, icon, info, children } = item;
  const isActiveRoot = active;
  const [open, setOpen] = useState(isActiveRoot);
  const {loginContext, setLoginContext} = useAuth();   
  
  

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  
  const handleClick = () => {
    setSelTopic(topic);
    setLoginContext({topic:topic});
    setLoginContext({mode:'view'});
  };

  const activeRootStyle = {
    color: 'primary.main',
    fontWeight: 'fontWeightMedium',
    bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    '&:before': { display: 'block' }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };

  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
        >
          <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
          <ListItemText disableTypography primary={title} />
          {info && info}
          <Iconify
            icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            sx={{ width: 16, height: 16, ml: 1 }}
          />
        </ListItemStyle>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((item) => {
              const { title, topic } = item;
              const isActiveSub = active(topic);

              return (
                <ListItemStyle
                  key={title}
                  component="div"
                  onClick={handleClick}
                  sx={{
                    ...(isActiveSub && activeSubStyle)
                  }}
                >
                  <ListItemIconStyle>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        display: 'flex',
                        borderRadius: '50%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'text.disabled',
                        transition: (theme) => theme.transitions.create('transform'),
                        ...(isActiveSub && {
                          transform: 'scale(2)',
                          bgcolor: 'primary.main'
                        })
                      }}
                    />
                  </ListItemIconStyle>
                  <ListItemText disableTypography primary={title} />
                </ListItemStyle>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <ListItemStyle
      component="div"
      onClick={handleClick}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}
    >
      <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
      <ListItemText disableTypography primary={title} />
      {info && info}
    </ListItemStyle>
  );
}

PatientNavSection.propTypes = {
  navConfig: PropTypes.array
};

export default function PatientNavSection({ navConfig,selTopic,setSelTopic, ...other }) {
  const match = (topic,selTopic) => (topic ? (topic ==selTopic) : false);

  return (
    <Box {...other}>
      <List disablePadding>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} active={item.topic ==selTopic}  selTopic={selTopic} setSelTopic={setSelTopic}  />
        ))}
      </List>
    </Box>
  );
}
