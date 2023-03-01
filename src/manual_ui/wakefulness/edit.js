import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";

export default class WakefulnessEdit extends React.Component {
	
	constructor(props) {
	    super(props);
	   
	    this.state = {
	       data: this.props.data,
    	   showLoading:false,
    	   isNewPatient:(this.props.data['Wakefulness.timeLine'] == undefined)
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
		   var path ='Patient/'+loginContext.mrn+'/Wakefulness';
		   var data = this.state.data;
	       
	       const headers = { 
	    		   'Content-Type' :'applicaiton/json',
	               'X-Requested-With':'XMLHttpRequest', 
	               'UCSFAUTH-TOKEN':loginContext.token,
	                'tagId':loginContext.selTag.tagId,
	                 'selRole':loginContext.selRole,
	                 'Content-Type': 'application/json'
	    		};
	       var rInfo = await axios.post(loginContext.apiUrl+"/patientinfo/"+path, JSON.stringify(data), { headers });
	       
	       if(rInfo && rInfo.data === true) {
	    	    this.setState({successMessage:'Patient Wakefulness changes saved successfully'});
	        	this.setState({errorMessage:null});
	        	this.props.goBackToList(null);
	        	
	       } else {
	    	   this.setState({errorMessage:'Failed to save Patient Wakefulness changes'});
	           this.setState({successMessage:null});
	       }
	
	       this.setState({showLoading:false});
   };
	
	onCancel = () => {
			this.props.goBackToList(null);
		};
	getRows  = (topicName) => {
		return this.props.loginContext.schema.filter(el => el.topic === topicName);
	};
	render() {
		const {topicName,schema,onChange,data} = this.props;  
		
		
		
		return (<PatientCardView
					rows={this.getRows(topicName)}
				    patientInfo={this.state.data}
				    fromList={true}
			        loginContext={this.props.loginContext}
			        onChange={(...args) => this.onChange(...args)}
				    successMessage={this.state.successMessage}
				    isNewPatient={this.state.isNewPatient}
					keyColumn={'timeLine'}
				    errorMessage={this.state.errorMessage} 
			        saveClick={(event)=>this.onSave(event)}
					cardTitle={topicName}
			        showLoading={this.state.showLoading}	
			        onCancel={() => this.onCancel()} />);
	}
}