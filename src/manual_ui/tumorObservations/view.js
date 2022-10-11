import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";






export default class TumorObservationsView extends React.Component {
	
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
		   result.sort((a, b) => (a.topicDisplayPriority > b.topicDisplayPriority) ? 1 : -1);
		  
		   return result;
    };
	
	
	async extractData () {
       
		const {config,mrn,loginContext} = this.props;
        this.setState({showLoading:true});
        var path ='Patient/'+loginContext.mrn+'/PatientTumor/'+this.props.parentInfo["PatientTumor.tumorLabel"]+'/TumorObservation';
        var patientInfo = await axios.get("https://btcdb-test.ucsf.edu/api/patientinfo/"+path, 
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
        
		
        if(!patientInfo || !patientInfo[0]["TumorObservation.observationDate"]){
        	patientInfo =null;
        }
         
        this.setState({showLoading:false,patientInfo:patientInfo});
   };

   componentDidMount(){
		this.extractData();
		
   };

	render() {
		const {topicName,schema,onEditClick,onNavigateClick,successMessage,errorMessage} = this.props;  
		return (  <PatientListView
				    rows={this.getRows(topicName)}
		            onEditClick={onEditClick}
		            onNavigateClick={onNavigateClick}
					grandInfo={this.props.parentInfo}
        			cardTitle={[{"topic":"Tumor","value":this.props.parentInfo["PatientTumor.tumorLabel"]},{"topic":topicName}]}	
		 			childTopics={this.fetchDistinctChildTopic(this.getChildTopics(topicName))}
				    successMessage={successMessage}
					loginContext={this.props.loginContext}
		            errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
					grandInfo={this.props.parentInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}