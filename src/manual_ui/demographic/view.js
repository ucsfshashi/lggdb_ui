import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";


export default class DemographicView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  demographicInfo:[],
	};

	getRows  = () => {
		
		var isNonPhi = (this.props.loginContext && this.props.loginContext.selRole == "NON_PHI" );
		var rows =this.props.loginContext.schema.filter(el => el.topic === "Demographics");
		
		if(isNonPhi) {
			rows = rows.filter(el => el.phi === false);
			rows = rows.filter(el => el.id != 'mrn');
		}
		
		return rows;
	};
	
	async extractData () {
        const {config,mrn,loginContext} = this.props;
        
        this.setState({showLoading:true});
	    var path ='Patient/'+loginContext.mrn;
        var demographicInfo = await axios.get(loginContext.apiUrl+"/patientinfo/"+path, 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId,
                                        'selRole':loginContext.selRole,
                                        'Accept': 'application/json',
                                    }}
                                    );
                                    
        if(demographicInfo && demographicInfo.data &&  demographicInfo.data.length > 0) {
        	demographicInfo = demographicInfo.data[0];
        }
        
        this.setState({showLoading:false,demographicInfo:demographicInfo});
   };
   
   async saveInServer ()  {

	  const {config,mrn,loginContext} = this.props;
	  
       this.setState({showLoading:true});
	   var tagId= loginContext.selTag.tagId;
	   var path ='Patient/'+loginContext.mrn;
       var data = this.state.demographicInfo;
       
       
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
       	this.setState({successMessage:'Demographic changes saved successfully'});
       	this.setState({errorMessage:null});
       } else {
       	this.setState({errorMessage:'Failed to save Demographic changes'});
       	this.setState({successMessage:null});
       }
       
       this.setState({showLoading:false});
	}
    
    onChange = (className,fieldId,value) => {
		
		var demographicInfo = this.state.demographicInfo;
		demographicInfo[className+'.'+fieldId] = value;
		
		this.setState({successMessage:null});
		this.setState({errorMessage:null});
		this.setState({demographicInfo:demographicInfo});
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
		const {schema,config,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <PatientCardView
				    rows={this.getRows()}
					saveClick={(event)=>this.onSave(event)}
					onChange={(...args) => this.onChange(...args)}
					onCancel={() => this.onCancel()}
		            config={config}
		            loginContext={this.props.loginContext}
		            isNewPatient={false}
		            keyColumn={'mrn'}
		            cardTitle="Demographics" 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.demographicInfo}
		            showLoading={this.state.showLoading}    
		       /> );
	}
}