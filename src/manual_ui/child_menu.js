import React from 'react';
import {Menu,MenuItem,Button} from '@mui/material';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Iconify from '../components/Iconify';


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
	  
	  return (
		<div>
	      <Button onClick={this.handleClick} >
			<FormatListBulletedIcon ontSize='small' />
		  </Button>	  
	      <Menu
	        id="simple-menu"
	        anchorEl={this.state.anchorEl}
	        keepMounted
	        open={Boolean(this.state.anchorEl)}
	        onClose={this.handleClose}>
	          { childTopics.map((item, key) =>
		         <MenuItem onClick={(event,parentInfo,topic,grandInfo)=>onNavigateClick(event,this.props.parentInfo,item.topic,this.props.grandInfo)}> 
		         <Iconify icon={'fa:'+item.icon} width={20} height={20} />{item.topic}</MenuItem>
		         ) 
		  	  }
	      </Menu>
	    </div>
	  );
  }
}