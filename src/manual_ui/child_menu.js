import React from 'react';
import {ListItemIcon,ListItemText,Paper,MenuList,Menu,MenuItem,Button,ClickAwayListener} from '@mui/material';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Iconify from '../components/Iconify';
import { styled, alpha } from '@mui/material/styles';


export default class ChildMenu extends React.Component {

	constructor(props) {
	    super(props);
	};

   state = {
		anchorEl: null
   };
  
  handleClick = (event) => {
    this.setState({anchorEl:event.currentTarget});
  };

  handleClose = () => {
	  this.setState({anchorEl:null});
  };

  render() {  
	  
	  const {onNavigateClick,parentInfo,childTopics,grandInfo} = this.props;
	  
	  const StyledMenu = styled((props: MenuProps) => (
			  <Menu
			    elevation={0}
			    anchorOrigin={{
			      vertical: 'bottom',
			      horizontal: 'right',
			    }}
			    transformOrigin={{
			      vertical: 'top',
			      horizontal: 'right',
			    }}
			    {...props}
			  />
			))(({ theme }) => ({
			  '& .MuiPaper-root': {
			    borderRadius: 6,
			    marginTop: theme.spacing(1),
			    minWidth: 180,
			    color:
			      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			    boxShadow:
			      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			    '& .MuiMenu-list': {
			      padding: '4px 0',
			    },
			    '& .MuiMenuItem-root': {
			      '& .MuiSvgIcon-root': {
			        fontSize: 25,
			        color: theme.palette.text.secondary,
			        marginRight: theme.spacing(1.5),
			      },
			      '&:active': {
			        backgroundColor: alpha(
			          theme.palette.primary.main,
			          theme.palette.action.selectedOpacity,
			        ),
			      },
			    },
			  },
			}));
	  
	  
	  return (
		<div>
	      <Button onClick={this.handleClick} >
			<FormatListBulletedIcon ontSize='small' />
		  </Button>	
		  <StyledMenu
	        id="simple-menu"
	        anchorEl={this.state.anchorEl}
	        keepMounted
	        open={Boolean(this.state.anchorEl)}
	        onClose={this.handleClose}
		  >
		      { childTopics.map((item, key) =>
		         <MenuItem onClick={(event,parentInfo,topic,grandInfo)=>onNavigateClick(event,this.props.parentInfo,item.topic,this.props.grandInfo)}> 
		           <ListItemIcon>
		         	<Iconify icon={'fa:'+item.icon} /> 
		          </ListItemIcon>
		          <ListItemText>{item.topic}</ListItemText>
		          </MenuItem>
		         ) 
		  	  }
	      </StyledMenu>
	    </div>
	  );
  }
}