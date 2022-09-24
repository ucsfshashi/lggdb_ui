import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";


export default class PastMedicalHistoryView extends React.Component {
	
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
	    var path ='Patient/'+loginContext.mrn+'/PastMedicalHistory';
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
	   var path ='Patient/'+loginContext.mrn+'/PastMedicalHistory';
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
    	   this.setState({successMessage:'Past medical history changes saved successfully'});
       	this.setState({errorMessage:null});
       } else {
    	   this.setState({errorMessage:'Failed to save Past medical history changes'});
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
		const {schema,topicName,config,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <PatientCardView
				    rows={this.getRows(topicName)}
					saveClick={(event)=>this.onSave(event)}
					onChange={(...args) => this.onChange(...args)}
					onCancel={() => this.onCancel()}
		            config={config}
		            loginContext={this.props.loginContext}
		            isNewPatient={false}
		            cardTitle={topicName} 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}