import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";


export default class GenericCardView extends React.Component {
	
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
        const {config,mrn,loginContext,path} = this.props;
        
        this.setState({showLoading:true});
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

	  const {config,mrn,loginContext,path} = this.props;
	  
       this.setState({showLoading:true});
	   var tagId= loginContext.selTag.tagId;
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
       	this.setState({successMessage:this.props.successMessage});
       	this.setState({errorMessage:null});
       } else {
       	this.setState({errorMessage:this.props.errorMessage});
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
		const {schema,config,topicName,keyColumn,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <PatientCardView
				    rows={this.getRows()}
					saveClick={(event)=>this.onSave(event)}
					onChange={(...args) => this.onChange(...args)}
					onCancel={() => this.onCancel()}
		            config={config}
		            loginContext={this.props.loginContext}
		            isNewPatient={false}
		            keyColumn={keyColumn}
		            cardTitle={topicName} 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}