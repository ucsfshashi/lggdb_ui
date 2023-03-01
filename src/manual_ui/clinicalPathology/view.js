import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";



export default class ClinicalPathologyView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:this.props.parentInfo,
	};
	
	getRows  = (topicName) => {
		return this.props.loginContext.schema.filter(el => el.topic === topicName);
	};
	
	async extractData () {
       
		const {config,mrn,loginContext} = this.props;
       
        this.setState({showLoading:true});
	    var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.parentInfo["Surgery.surgeryDate"]+'/ClinicalPathology';
        
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
                                    
        if(patientInfo && patientInfo.data &&  patientInfo.data.length > 0) {
        	patientInfo = patientInfo.data[0];
        }
        
        this.setState({showLoading:false,patientInfo:patientInfo});
   };
   
   
   async saveInServer ()  {

		  const {config,mrn,loginContext} = this.props;
		  
	       this.setState({showLoading:true});
		   var tagId= loginContext.selTag.tagId;
		   var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.parentInfo["Surgery.surgeryDate"]+'/ClinicalPathology';
	       var data = this.state.patientInfo;
	       
	       
	       const headers = { 
	    		   'Content-Type' :'applicaiton/json',
	               'X-Requested-With':'XMLHttpRequest', 
	               'UCSFAUTH-TOKEN':loginContext.token,
	                'tagId':loginContext.selTag.tagId,
	                 'selRole':loginContext.selRole,
	                 'Content-Type': 'application/json'
	    		};
	       var rInfo = await axios.post(loginContext.apiUrl+"/patientinfo/"+path, JSON.stringify(data), { headers })
	       
	       if(rInfo && rInfo.data === true) {
	       	this.setState({successMessage:'Clinical Pathology changes saved successfully'});
	       	this.setState({errorMessage:null});
	       } else {
	       	this.setState({errorMessage:'Failed to save Clinical Pathology changes'});
	       	this.setState({successMessage:null});
	       }
	       
	       this.setState({showLoading:false});
		}
	    
	    onChange = (className,fieldId,value) => {
			
			var patientInfo = this.state.patientInfo;
			patientInfo[className+'.'+fieldId] = value;
			
			this.setState({successMessage:null});
			this.setState({errorMessage:null});
			this.setState({patientInfo:patientInfo});
		};
		
		onSave = (event) => {
			this.setState({showLoading:true});
			this.saveInServer();
	    };
		
		onCancel = () => {
			this.extractData();
		};
   
   
   
	
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {topicName,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <PatientCardView
				   saveClick={(event)=>this.onSave(event)}
				   onChange={(...args) => this.onChange(...args)}
	    		   onCancel={() => this.onCancel()}
				   isNewPatient={false}
				    rows={this.getRows(topicName)}
		            onEditClick={onEditClick}
					loginContext={this.props.loginContext}
					cardTitle={[{"topic":"Surgery","value":this.props.parentInfo["Surgery.surgeryDate"]},{"topic":topicName}]}	
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}