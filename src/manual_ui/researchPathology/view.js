import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";


export default class ResearchPathologyView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:[],
	};
	
	getRows  = (topicName) => {
		return this.props.loginContext.schema.filter(el => el.topic === topicName);
	};
	
	async extractData () {
        const {config,mrn,loginContext} = this.props;
        
        this.setState({showLoading:true});
	    var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.grandInfo["Surgery.surgeryDate"]+
        '/Tissue/'+this.props.parentInfo["Tissue.tissueBankId"]+'/ResearchPathology';
	    
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
                                    
        if(patientInfo && patientInfo.data &&  patientInfo.data.length > 0) {
        	patientInfo = patientInfo.data[0];
        }
        
        this.setState({showLoading:false,patientInfo:patientInfo});
   };
   
   
   async saveInServer ()  {

		  const {config,mrn,loginContext} = this.props;
		  
	       this.setState({showLoading:true});
		   var tagId= loginContext.selTag.tagId;
		   var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.grandInfo["Surgery.surgeryDate"]+
	        '/Tissue/'+this.props.parentInfo["Tissue.tissueBankId"]+'/ResearchPathology';
	       var data = this.state.patientInfo;
	       
	       
	       const headers = { 
	    		   'Content-Type' :'applicaiton/json',
	               'X-Requested-With':'XMLHttpRequest', 
	               'UCSFAUTH-TOKEN':loginContext.token,
	                'tagId':loginContext.selTag.tagId,
	                 'selRole':loginContext.selRole,
	                 'Content-Type': 'application/json'
	    		};
	       var rInfo = await axios.post("https://btcdb-test.ucsf.edu/api/patientinfo/"+path, JSON.stringify(data), { headers })
	       
	       if(rInfo && rInfo.data === true) {
	       	this.setState({successMessage:'Research Pathology changes saved successfully'});
	       	this.setState({errorMessage:null});
	       } else {
	       	this.setState({errorMessage:'Failed to save Research Pathology changes'});
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
		const {topicName,schema,onEditClick,successMessage,errorMessage} = this.props;  
		return (
				<PatientCardView
				    rows={this.getRows(topicName)}
				    saveClick={(event)=>this.onSave(event)}
		            onEditClick={onEditClick}
				    onChange={(...args) => this.onChange(...args)}
				    onCancel={() => this.onCancel()}
				    loginContext={this.props.loginContext}
				    isNewPatient={false}
					keyColumn={'tissueBankVialId'}	
					loginContext={this.props.loginContext}
		            cardTitle={'Surgery('+this.props.grandInfo["Surgery.surgeryDate"]+')'
						+'/Tissue('+this.props.parentInfo["Tissue.tissueBankId"]+')/'+topicName} 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       />);
	}
}
