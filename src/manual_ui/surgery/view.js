import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";


export default class SurgeryView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:[],
	};
	
	getRows  = () => {
		return this.props.loginContext.schema.filter(el => el.topic === "Surgery");
	};
	
	getChildTopics  = () => {
		return this.props.loginContext.schema.filter(el => el.parent === "Surgery");
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
        var path ='Patient/'+loginContext.mrn+'/Surgery';
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
        
		
        if(!patientInfo || !patientInfo[0]["Surgery.surgeryDate"]){
        	patientInfo =null;
        }
         
        this.setState({showLoading:false,patientInfo:patientInfo});
   };
	
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {schema,onEditClick,onNavigateClick,goBackToList,successMessage,errorMessage} = this.props;  
		return (  <PatientListView
				    rows={this.getRows()}
		            onEditClick={onEditClick}
		            onNavigateClick={onNavigateClick}
		            goBackToList={goBackToList}
		            loginContext={this.props.loginContext}
		            cardTitle="Surgery" 
				    successMessage={successMessage}
		            childTopics={this.fetchDistinctChildTopic(this.getChildTopics())}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}