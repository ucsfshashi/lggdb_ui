import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";

export default class SurgeryEdit extends React.Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	       data: this.props.data,
    	   showLoading:false,
    	   isNewPatient:(this.props.data && this.props.data['Surgery.surgeryDate'] == undefined)
		};
	};
	
	
	/**OnChange specific to Demographic Card
	 **/
	onChange = (className,fieldId,value) => {
		
		var data = this.state.data;
		
		data[className+'.'+fieldId] = value;
		this.setState({successMessage:null});
		this.setState({errorMessage:null});
		this.setState({data:data});
	};
	
	onSave = (event) => {
		this.setState({showLoading:true});
		this.saveInServer();
       
	};
	
	async saveInServer ()  {

		
		const {config,mrn,loginContext} = this.props;
		  
	       this.setState({showLoading:true});
		   var tagId= loginContext.selTag.tagId;
		   var path ='Patient/'+loginContext.mrn+'/Surgery';
		   var data = this.state.data;
	       
	       
	       const headers = { 
	    		   'Content-Type' :'applicaiton/json',
	               'X-Requested-With':'XMLHttpRequest', 
	               'UCSFAUTH-TOKEN':loginContext.token,
	                'tagId':loginContext.selTag.tagId,
	                 'selRole':loginContext.selRole,
	                 'Content-Type': 'application/json'
	    		};
	       var rInfo = await axios.post("https://btcdb-test.ucsf.edu/api/patientinfo/"+path, JSON.stringify(data), { headers });
	       
	       if(rInfo && rInfo.data === true) {
	    	    this.setState({successMessage:'Surgery changes saved successfully'});
	        	this.setState({errorMessage:null});
	        	this.props.goBackToList(null);
	        	
	       } else {
	    	   this.setState({errorMessage:'Failed to save Surgery changes'});
	           this.setState({successMessage:null});
	       }
	
	       this.setState({showLoading:false});
	};
	
	getRows  = () => {
		return this.props.loginContext.schema.filter(el => el.topic === "Surgery");
	};
	render() {
		const {onChange,data} = this.props;  
	
		return (<PatientCardView
			    rows={this.getRows()}
			    patientInfo={this.state.data}
		        loginContext={this.props.loginContext}
		        onChange={(...args) => this.onChange(...args)}
			    successMessage={this.state.successMessage}
			    isNewPatient={this.state.isNewPatient}
		        keyColumn={'surgeryDate'}
			    errorMessage={this.state.errorMessage} 
		        saveClick={(event)=>this.onSave(event)}
		        cardTitle="Surgery" 
		        showLoading={this.state.showLoading}	
		        onCancelClick={this.props.onCancelClick}
		        />);
	}
}