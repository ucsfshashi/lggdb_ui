import React from 'react';
import PatientCardEdit from '../patient_card_edit';


export default class DemographicEdit extends React.Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	 data: this.props.data,
	    	 showLoading:false
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
	    
        var tagId= loginContext.tagId;
        var path ='Patient/'+mrn;
        var data = this.state.data;
       // var rInfo = await Actions.savePatientInfo({config,path,tagId,data});
        var rInfo =null;
        
        if(rInfo === true) {
        	this.setState({successMessage:'Demographic changes saved successfully'});
        	this.setState({errorMessage:null});
        } else {
        	this.setState({errorMessage:'Failed to save Demographic changes'});
        	this.setState({successMessage:null});
        }
      
        this.setState({showLoading:false});
	}
	
	getRows  = () => {
		return this.props.schema.filter(el => el.className === "Patient" && el.id !='tags');
	};
	
	render() {
		const {schema,successMessage,errorMessage} = this.props;  
		 
		return (<PatientCardEdit
				    rows={this.getRows()}
				    data={this.state.data}
		            onChange={(...args) => this.onChange(...args)}
				    successMessage={this.state.successMessage}
				    isNewPatient={false}
					keyColumn={'mrn'}
				    errorMessage={this.state.errorMessage} 
		            saveClick={(event)=>this.onSave(event)}
		            cardTitle="Demographics" 
		            showLoading={this.state.showLoading}	
		            onCancelClick={this.props.onCancelClick}
		/>);
	}
}
