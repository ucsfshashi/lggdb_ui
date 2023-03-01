import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";


export default class QABView  extends React.Component {
	
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
	
	async extractData () {
        const {config,mrn,loginContext} = this.props;
        
		this.setState({showLoading:true});
		var path ='Patient/'+loginContext.mrn+'/QAB';
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
        
        
        if(!patientInfo || !patientInfo[0]["QAB.timeLine"]){
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
		            patientInfo={this.state.patientInfo}
					grandInfo={this.props.parentInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}