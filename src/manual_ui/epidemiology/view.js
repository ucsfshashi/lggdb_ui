import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";
import PatientRouter from '../patient_router';
import TabMenu from '../tab_menu';

export default class EpidemiologyView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  demographicInfo:[],
	};
	
	getRows  = () => {
		return this.props.loginContext.schema.filter(el => el.topic === "Epidemiology");
	};
	
	async extractData () {
        const {config,mrn,loginContext} = this.props;
        
		this.setState({showLoading:true});
		var path ='Patient/'+loginContext.mrn+'/Epidemiology';
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
       
        this.setState({showLoading:false,demographicInfo:patientInfo});
   };
	
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {topicName,loginContext,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <div><PatientCardView
				    rows={this.getRows()}
		            onEditClick={onEditClick}
		            cardTitle="Epidemiology" 
		            loginContext={this.props.loginContext}	
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.demographicInfo}
		            showLoading={this.state.showLoading}    
		       />  {this.state.showLoading == false && <TabMenu topicName={topicName} 
                    schema={loginContext.schema} 
                    mrn={this.props.mrn} 
		 			parentId={this.state.demographicInfo[0]["Epidemiology.epiLggid"]}
       			 	onEditClick={this.props.onEditClick}
		            loginContext={this.props.loginContext}		
       			 	successMessage={this.props.successMessage}
       			 	errorMessage={this.props.errorMessage}
		             config={this.props.config} 
		            />} </div> );
	}
}