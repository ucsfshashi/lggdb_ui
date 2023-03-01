import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";


export default class DiagnosisView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:[],
	};
	
	getRows  = () => {
		var rows = this.props.loginContext.schema.filter(el => (el.topic === "Diagnosis" 
			   || (el.className === "Surgery" && el.id ==="surgeryDate")) );
		
		if(rows[0].className === 'Surgery') {
			this.arraymove(rows,0,rows.length-2);
		}
		
		return rows;
	};
	
    arraymove = (arr,fromIndex,toIndex) => {
	    var element = arr[fromIndex];
	    arr.splice(fromIndex, 1);
	    arr.splice(toIndex, 0, element);
	};
	
	async extractData () {
       
		const {config,mrn,loginContext} = this.props;
        
		this.setState({showLoading:true});
        var path ='Patient/'+loginContext.mrn+'/Diagnosis';
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
        
        
        if(!patientInfo || !patientInfo[0]["Diagnosis.diagnosisDate"]){
        	patientInfo =null;
        }
        
        this.setState({showLoading:false,patientInfo:patientInfo});
        
   };
	
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {schema,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <PatientListView
				    rows={this.getRows()}
		            onEditClick={onEditClick}
		            cardTitle="Diagnosis" 
		            loginContext={this.props.loginContext}	
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}