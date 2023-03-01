import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";


export default class LoglioCognitiveView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:[],
	};
	
	getRows  = (topicName) => {
		return this.props.loginContext.schema.filter(el => el.topic === topicName);
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
		           
		               result.push({
			        	   topic: item.topic,
			        	   className:item.className,
			        	   icon:item.icon,
			               topicDisplayPriority: item.topicDisplayPriority
			           });
		          
		       }
		   }
		  
		   // Sort topic to generate left menu
		   result.sort((a, b) => (a.topicDisplayPriority > b.topicDisplayPriority) ? 1 : -1);
		  
		   return result;
   };
	
	async extractData () {
       
		const {config,mrn,loginContext} = this.props;
        
		this.setState({showLoading:true});
		var path ='Patient/'+loginContext.mrn+'/LoglioCognitive';
        var patientInfo = await axios.get(loginContext.apiUrl+"/patientinfo/"+path, 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId,
                                        'selRole':loginContext.selRole,
                                        'Accept': 'application/json',
                                    }}
                                    );
         
        if(patientInfo) {
        	patientInfo = patientInfo.data;
        }
        
        
        if(!patientInfo || !patientInfo[0]["LoglioCognitive.timeLine"]){
        	patientInfo =null;
        }
        
        this.setState({showLoading:false,patientInfo:patientInfo});
        
        
        
        
   };

   componentDidMount(){
		this.extractData();
		
   };

	render() {
		const {topicName,onEditClick,onNavigateClick,successMessage,errorMessage} = this.props;  
		return (  <PatientListView
				    rows={this.getRows(topicName)}
		            onEditClick={onEditClick}
					loginContext={this.props.loginContext}	
		            onNavigateClick={onNavigateClick}
		            cardTitle={topicName} 
		 			successMessage={successMessage}
		            errorMessage={errorMessage} 
		            childTopics={this.fetchDistinctChildTopic(this.getChildTopics(topicName))}
		            patientInfo={this.state.patientInfo}
					grandInfo={this.props.parentInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}