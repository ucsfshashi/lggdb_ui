import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";



export default class CopyNumberChangeRowView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:[],
	};
	
	getRows  = () => {
		return this.props.loginContext.schema.filter(el => el.topic === this.props.topicName);
	};
	
	async extractData () {
         	const {config,mrn,loginContext} = this.props;
            
    		this.setState({showLoading:true});
            var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.grandParentId+'/UCSF500/'+this.props.parentId+'/CopyNumberChangeRow';
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
            
            
            if(!patientInfo || (!patientInfo[0]["CopyNumberChangeRow.chromosomeSegment"] && !patientInfo[0]["CopyNumberChangeRow.chromosome"]  && patientInfo.length == 1 ) ){
            	patientInfo =null;
            }
            
            this.setState({showLoading:false,patientInfo:patientInfo});	
        	
        
   };
	
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {onEditClick,onNavigateClick,successMessage,errorMessage} = this.props;  
		return (  <PatientListView
				    rows={this.getRows()}
		            onEditClick={onEditClick}
					cardTitle="CopyNumberChangeRow" 
					onNavigateClick={onNavigateClick}		
					loginContext={this.props.loginContext}
		            successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}


