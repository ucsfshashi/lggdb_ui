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
	  patientInfo:[],
	};
	
	getRows  = () => {
		return this.props.loginContext.schema.filter(el => el.topic === "Epidemiology");
	};
	
	async extractData () {
        const {config,mrn,loginContext} = this.props;
        
		this.setState({showLoading:true});
		var path ='Patient/'+loginContext.mrn+'/Epidemiology';
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
        	patientInfo = patientInfo.data[0];
        }
       
        this.setState({showLoading:false,patientInfo:patientInfo});
   };
   
   async saveInServer ()  {

		  const {config,mrn,loginContext} = this.props;
		  
	       this.setState({showLoading:true});
		   var tagId= loginContext.selTag.tagId;
		   var path ='Patient/'+loginContext.mrn+'/Epidemiology';
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
	       	this.setState({successMessage:'Epidemiology changes saved successfully'});
	       	this.setState({errorMessage:null});
	       } else {
	       	this.setState({errorMessage:'Failed to save Epidemiology changes'});
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
		const {topicName,loginContext,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <div><PatientCardView
				    rows={this.getRows()}
					saveClick={(event)=>this.onSave(event)}
					onChange={(...args) => this.onChange(...args)}
					onCancel={() => this.onCancel()}
        			onEditClick={onEditClick}
		            cardTitle="Epidemiology" 
		            loginContext={this.props.loginContext}	
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}    
		       />  {this.state.showLoading == false && <TabMenu topicName={topicName} 
                    schema={loginContext.schema} 
                    mrn={this.props.mrn} 
		 			parentId={this.state.patientInfo["Epidemiology.epiLggid"]}
       			 	onEditClick={this.props.onEditClick}
		            loginContext={this.props.loginContext}		
       			 	successMessage={this.props.successMessage}
       			 	errorMessage={this.props.errorMessage}
		             config={this.props.config} 
		            />} </div> );
	}
}