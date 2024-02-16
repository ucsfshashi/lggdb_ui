import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ITEM_HEIGHT = 48;

export default function LongMenu(props) {
	
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selValue, setSelValue] = React.useState('Patient');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
	if(event.currentTarget) {  
		setAnchorEl(event.currentTarget);
	}
  };
  const handleClose = (val) => {
    if(typeof val === 'string') {  
		setSelValue(val);
	    props.onSelEntity(val);
	    setAnchorEl(null);
	}
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        sx={{'color':'black','fontWeight':'bold'}}	
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
         {selValue}  <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {props.options.map((option) => (
          <MenuItem key={option} sx={{'color':'black','fontWeight':'bold'}} selected={option === selValue} onClick={()=>handleClose(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
