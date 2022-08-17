import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";


export default class RadiotherapyView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:[],
	};
	
	getRows  = () => {
		return this.props.loginContext.schema.filter(el => el.topic === "Radiotherapy");
	};
	
	async extractData () {
       
		const {config,mrn,loginContext} = this.props;
        
		this.setState({showLoading:true});
		var path ='Patient/'+loginContext.mrn+'/Radiotherapy';
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
        
        
        if(!patientInfo || !patientInfo[0]["Radiotherapy.radiotherapyStartDate"]){
        	patientInfo =null;
        }
        
        
        this.setState({showLoading:false,patientInfo:patientInfo});
        
        
   };
	
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {onEditClick,successMessage,errorMessage} = this.props;  
		return (  <PatientListView
				    rows={this.getRows()}
		            onEditClick={onEditClick}
					loginContext={this.props.loginContext}
		            cardTitle="Radiotherapy" 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}