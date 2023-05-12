import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import {createMuiTheme,ThemeProvider} from '@mui/material/styles';
import Iconify from '../../../components/Iconify';
import axios from "axios";




export default class StudyChildMenu extends React.Component {

	
	
	constructor(props) {
	    super(props);
	};

   state = {
		anchorEl: null
   };
   
   getMuiTheme = () => createMuiTheme({
	   overrides: {
		   MuiMenu :{
			   paper :{
				   width:'250px',
				   fontFamily:'Helvetica Light',
	    	       fontSize:'1.5rem',
	    	       letterSpacing:'0.03em',
			   }
		   },
		   MuiMenuItem :{
			   root :{
				   fontFamily:'Helvetica Light',
	    	       fontSize:'1.5rem',
	    	       letterSpacing:'0.03em',
			   }
		   },
		   MuiTypography:{
			   body1 :{
				   fontFamily:'Helvetica Light',
	    	       fontSize:'1.5rem',	
	    	       letterSpacing:'0.03em',
			   }
		   },
		   MuiButton :{
			   label:{
				   textTransform:'none',
				   fontFamily:'Helvetica Light',
	    	       fontSize:'1.5rem',
	    	       letterSpacing:'0.03em',
			   }
		   }
	   }
   });

  handleClick = (event) => {
    this.setState({anchorEl:event.currentTarget});
  };

  handleClose = () => {
	  this.setState({anchorEl:null});
  };
  
  async handleRemove(row) {
	  
	 
  	if (window.confirm('Are you sure you want to delete "'+row["tag"]['tagName'] +' "  Study?')) {
  		
  		const headers = { 
        		   'Content-Type' :'application/json',
                'X-Requested-With':'XMLHttpRequest',
                'UCSFAUTH-TOKEN':this.props.loginContext.token
        	  };
     	  
     	 var rInfo=await axios.delete(this.props.loginContext.apiUrl+"/studyTag/"+row.tag.tagId, 
     			  { headers }).catch((err) => {
     					if(err && err.response)
     						if(err.response.status != 200) 
     							window.alert("Error while deleting study tag");
     						});    
     	 
     	  if(rInfo.status==200) {
     		  window.location.reload(false);
     	  }
  	}
  	
  }
  
  handleAssignUser = (row,mode) => {
  	  this.props.setStudyAction("assignUser");
	  this.props.setSelTagInfo(this.props.tag);
  }
  
  handleUploadTemplates = (row) => {
	  this.props.setStudyAction("templates");
	  this.props.setSelTagInfo(this.props.tag);
   }
  
  handleDataTypes = (row) => {
	  this.props.setStudyAction("dataTypes");
	  this.props.setSelTagInfo(this.props.tag);
	}

  render() {  
	  
	  const {tag} = this.props;
	  
	  return (
		<ThemeProvider theme={this.getMuiTheme()}>
	     <Button
	        variant="outlined" 
	        size="large"
	        	color="success" 	
	        startIcon={<Iconify icon={'eva:list-fill'} width={22} height={22} />} onClick={this.handleClick} >
	        Action
	      </Button>
		  <Menu
	        id="simple-menu"
	        anchorEl={this.state.anchorEl}
	        keepMounted
	        open={Boolean(this.state.anchorEl)}
	        onClose={this.handleClose}>
	             <MenuItem  onClick={(event)=>this.handleDataTypes(tag)} >
	                <Iconify color="success" 	 icon={'eva:layers-fill'} width={22} height={22} />Define data types 
		         </MenuItem>
		         <MenuItem onClick={() => this.handleAssignUser({tag},'phi') } > 
		           <Iconify color="success" 	 icon={'eva:person-done-fill'} width={22} height={22} />Assign users
		         </MenuItem>
		       {tag.noOfDataTypes >0  && <MenuItem divider />  }
		  	      {tag.noOfDataTypes >0  && <MenuItem  eventKey="3"   onClick={() => this.handleUploadTemplates({tag}) } >  <Iconify icon={'eva:file-text-outline'} width={22} height={22} /> Study templates </MenuItem> }
		  	      {
		  	    	tag.noOfPatients <=0 && this.props.loginContext.selRole =='ADMIN' && 
		      	      <MenuItem divider />
		  	      }
		      	  {
		      		tag.noOfPatients <=0 &&  this.props.loginContext.selRole =='ADMIN' && 
		      	      	<MenuItem  eventKey="4"    onClick={() => this.handleRemove({tag}) } > 
		      				<Iconify icon={'eva:trash-2-fill'} width={22} height={22} /> Delete 
		      	    	</MenuItem>
		  	      }
		  </Menu>
	    </ThemeProvider>
	  );
  }
}