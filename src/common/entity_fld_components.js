import React from 'react';
import Iconify from '../components/Iconify';

import {ListItemButton,ListItemIcon,ListItemText,
ListItem,IconButton,Switch,
Stack,Typography,TextField,FormControl,InputLabel,Select,MenuItem,Box,Skeleton} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';



export class EntityDiv extends React.Component {
	constructor(props) {
	    super(props);
	}
	render() {
	
		const enabledCnt = this.props.fiedCount(this.props.label);
		return (
			<ListItem
				  key={this.props.fieldId}
	              disablePadding >
				<ListItemButton key={this.props.label}  selected={this.props.isActive} onClick={(evt,element) => this.props.handleEntityClick(evt,this.props.label)}>
			         <ListItemIcon>
			         	<Iconify icon={this.props.icon}/>
			         </ListItemIcon>
			         <ListItemText primary={this.props.label}/>
			      </ListItemButton>
			  	 
			  	 {enabledCnt >0 &&
	  			     <Typography variant="h5">
	                     {enabledCnt}
	  		         </Typography>
	  		     }
  		         {  enabledCnt >0 ?  <NotificationsActiveIcon sx={{'color':'green'}} /> :
  		         	<NotificationsOffIcon sx={{'color':'green'}} />
  		         }
  		         
      	     </ListItem> 
		);
	}
}
	
	
export class FieldDiv extends React.Component {
	constructor(props) {
	    super(props);
	}
	render() {
		
		return (
				<ListItem
				  key={this.props.fieldId}
	              disablePadding >
	            <ListItemButton role={undefined} onClick={this.props.onClick}  selected={this.props.isActive} >
	              <ListItemText  id={this.props.fieldId} primary={this.props.fieldDisplayName} />
	            </ListItemButton>
	              <Switch
          			edge="end"
          			onChange={this.props.handleCheckBoxChange} 
          			checked={this.props.enabled === true} 
          			inputProps={{
            				'aria-labelledby': 'switch-list-label-wifi',
         			 }}
        		  />
	          </ListItem>
		);
	}
}


export class FieldDetailsDiv extends React.Component {
	constructor(props) {
	    super(props);
	}
	render() {
		const {activeFieldElement} = this.props;
		console.log(activeFieldElement.displayName);
		return (
				<Box component="form">
				<Stack spacing={3} >	
				
      			<Typography variant="h4" component="h3">
		         	{activeFieldElement.displayName}
		        </Typography>
      		
	      		<TextField
	          		InputProps={{
            			readOnly: true,
          			}}
	          		id="className"
	          		label="Class name"
	          		value={activeFieldElement.className}
	        	/>
	        	
	        	<TextField
	          		InputProps={{
            			readOnly: true,
          			}}
	          		id="fieldId"
	          		label="Id"
	          		value={activeFieldElement.id}
	        	/>
	        	
	        	<TextField
	          		InputProps={{
            			readOnly: true,
          			}}
	          		id="phi"
	          		label="PHI"
	          		value={activeFieldElement.phi?"True":"False"}
	        	/>
	        	
	        	
	        	<TextField
	          		InputProps={{
            			readOnly: true,
          			}}
	          		id="fieldType"
	          		label="Field type"
	          		value={activeFieldElement.type}
	        	/>
	        	
	        	
	        	<FormControl fullWidth>
				  <InputLabel id="editableSelLabel">Editable</InputLabel>
				  <Select
				    labelId="editableSelLabel"
				    id="editableSelId"
				    value={activeFieldElement.editable?'Y':'N'}
				    label="Editable"
				     onChange={(e) => this.props.handleEditable(e)}  
				    >
				    <MenuItem value={'Y'}>True</MenuItem>
				    <MenuItem value={'N'}>False</MenuItem>
				  </Select>
				</FormControl>
	        	
	        	
	        	
	        	<TextField
	          		id="displayName"
	          		label="Display name"
	          		onChange={(e) =>this.props.handleDisplayNameChange(e)} 
	          		value={activeFieldElement.displayName}
	        	/>
	        	
	        	<TextField
	          		id="nonDisplayName"
	          		label="Non-PHI Display name"
	          		onChange={(e) =>this.props.handleNonPHIDisplayNameChange(e)} 
	          		value={activeFieldElement.nonPHIDisplayName}
	        	/>
	       		</Stack>
	       </Box>
		);
	}
}