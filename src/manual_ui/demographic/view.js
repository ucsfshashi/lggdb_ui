import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";


export default class DemographicView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  demographicInfo:[],
	};
	
	getRows  = () => {
		
		var isNonPhi = (this.props.loginContext && this.props.loginContext.selRole == "NON_PHI" );
		var rows =this.props.loginContext.schema.filter(el => el.topic === "Demographics");
		
		if(isNonPhi) {
			rows = rows.filter(el => el.phi === false);
			rows = rows.filter(el => el.id != 'mrn');
		}
		
		return rows;
	};
	
	async extractData () {
        const {config,mrn,loginContext} = this.props;
        this.setState({showLoading:true});
	    var path ='Patient/'+loginContext.mrn;
        var demographicInfo = await axios.get("https://btcdb-test.ucsf.edu/api/patientinfo/"+path, 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId,
                                        'selRole':loginContext.selRole,
                                        'Accept': 'application/json',
                                    }}
                                    );
                                    
        this.setState({showLoading:false,demographicInfo:demographicInfo.data});
   };
   
  
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {schema,config,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <PatientCardView
				    rows={this.getRows()}
		            onEditClick={onEditClick}
		            config={config}
		            loginContext={this.props.loginContext}
		            cardTitle="Demographics" 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.demographicInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}