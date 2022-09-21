import React from 'react';
import {Tabs,Tab,Box,Paper} from '@mui/material';
import PatientRouter from './patient_router';

export default class TabMenu extends React.Component {

	constructor(props) {
	    super(props);
	};
	
   state = {
		tabIndex:0,
		mode:'view'
   };
  
   handleChange = (event, newValue) => {
	   this.setState({tabIndex:newValue,mode:'view'});
   };
   
   
   getChildTopics  = (topicName) => {
		return this.props.loginContext.schema.filter(el => el.parent === topicName);
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
  
  goBackToList=(event) => {
	  this.setState({mode:'view'});
  };
  
  
   render() {  
	  
	  const {topicName} = this.props;
	  const childTopics = this.fetchDistinctChildTopic(this.getChildTopics(topicName));
	  
	  return (
		  <Paper sx={{ marginTop: '15px' }} >
		     { this.props.parentId && childTopics && childTopics.length >0  &&
		    	  <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
		           { childTopics.length > 1 &&
		             <Tabs
		        	   value={this.state.tabIndex} 
		               onChange={this.handleChange}
		        	   >
		           		{ childTopics.map((item, key) =>
		           				<Tab label={item.topic} />
		           			)}
		        	 </Tabs>
		        	
		           }
		           <div>
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
		             goBackToList={(event) => this.goBackToList(event)}
		            />
		           </div>
		        </Box>
		     }
		  </Paper>	    
	  );
  }
}