import React from 'react';
import PatientListView from '../patient_list_view';
import axios from "axios";


export default class CgpAlterationRowView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:[],
	};
	
	getRows  = () => {
		return this.props.loginContext.schema.filter(el => el.topic === "CgpAlterationRow");
	};
	
	async extractData () {
        const {config,mrn,loginContext} = this.props;
        
		this.setState({showLoading:true});
        var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.grandParentId+'/CancerGenePanel/'+this.props.parentId+'/CgpAlterationRow';
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
        
        
        if(!patientInfo || !patientInfo[0]["CgpAlterationRow.cgpVariant"]){
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
		            cardTitle="CgpAlterationRow" 
		            loginContext={this.props.loginContext}	
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}