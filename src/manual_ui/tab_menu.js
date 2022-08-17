import React from 'react';
import {createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import {Tabs,Tab,Button,AppBar} from '@mui/material';
import Iconify from '../components/Iconify';
import PatientRouter from './patient_router';


export default class TabMenu extends React.Component {

	constructor(props) {
	    super(props);
	};
	
   state = {
		tabIndex:0,
		mode:'view'
   };
   
     
   getMuiTheme = () => createMuiTheme({
	   overrides: {
		   MuiButton :{
			   root :{
				   textTransform:'none',
				   color: '#f5f5f5'  
			   }
		   },
		   MuiAppBar: {
        	   root:{
        		   marginLeft:'9px',
        		   marginTop:'9px',
        		   width:'95%',
        		   borderRadius: '3px'
        	   },
        	   colorPrimary :{
        		    backgroundColor: '#007CBE'
        	   }
           },
           MuiTab : {
        	   selected:{
        		   backgroundColor:'#092e44'
        	   }
           },
           TabIndicator:{
        	   colorPrimary :{
        		   backgroundColor: 'white'
        	   }
           }
	   }
   });
   
   handleChange = (event, newValue) => {
	   this.setState({tabIndex:newValue,mode:'view'});
   };
   
   
   getChildTopics  = (topicName) => {
		return this.props.schema.filter(el => el.parent === topicName);
	};
	
	fetchDistinctChildTopic = (array) => {
		      
		   const result = [];
		   const map = new Map();
		   for (const item of array) {
		       if(!map.has(item.topic)){
		           map.set(item.topic, true);    // set any value to Map
		           
		           if(item.id !='referenceEventDate') {
			           result.push({
			        	   topic: item.topic,
			        	   className:item.className,
			        	   icon:item.icon,
			               topicDisplayPriority: item.topicDisplayPriority
			           });
		           }
		       }
		   }
		  
		   // Sort topic to generate left menu
		   result.sort((a, b) => (a.topic > b.topic) ? 1 : -1);
		  
		   return result;
  };
  
  handleEditClick=(event,info) => {
	   event.preventDefault(); 
	   this.setState({mode:'edit',data:info});
  };
  
  handleCancelClick = (event) => {
	   if(event) {
		   event.preventDefault(); 
	   }
	   
	   this.setState({mode:'view'});
  };
  
  
   render() {  
	  
	  const {topicName} = this.props;
	  const childTopics = this.fetchDistinctChildTopic(this.getChildTopics(topicName));
	  
	  return (
		  <div>
		     { this.props.parentId && childTopics && childTopics.length >0  && 
			  <MuiThemeProvider theme={this.getMuiTheme()}>	
				 	
		           { childTopics.length > 1 &&
		        	<AppBar position="static" square='false'>  	
				  	    <Tabs value={this.state.tabIndex} 
					  		indicatorColor="primary"
					        textColor="primary"
					        onChange={this.handleChange}>
					  	  
					     { childTopics.map((item, key) =>
					      <Tab  icon={
					     		<Button variant='text'>
					     		  <Iconify icon={'fa:'+item.icon} width={20} height={20} />{item.topic}
					     	  </Button>} />   
						  )}
					    </Tabs>
					  </AppBar>   
		           }
				    
				    
				    <PatientRouter  
				         topicName={childTopics[this.state.tabIndex].topic} 
				         mode={this.state.mode}  
				         grandParentId={this.props.grandParentId}
				    	 loginContext={this.props.loginContext}
				    	 parentId={this.props.parentId}
				         schema={this.props.schema}
				         onEditClick={(event, info) => this.handleEditClick(event, info)}
				         successMessage={this.props.successMessage}
				         errorMessage={this.props.errorMessage}
				         config={this.props.config}
				         mrn={this.props.mrn}
				         parentKey={this.props.parentKey} 
				         grandParentKey={this.props.grandParentKey} 
				         data={this.state.data}
				         onCancelClick={(event) => this.handleCancelClick(event)}
				    />
			  </MuiThemeProvider>
		     }
		  </div>	    
	  );
  }
}