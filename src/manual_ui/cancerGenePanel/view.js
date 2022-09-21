import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";

import TabMenu from '../tab_menu';
import {Stack} from '@mui/material';

export default class CancerGenePanelView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
	  showLoading: true,
	  patientInfo:this.props.parentInfo
	};
	
	getRows  = (topicName) => {
		return this.props.loginContext.schema.filter(el => el.topic === topicName);
	};
	
	async extractData () {
        
		const {config,mrn,loginContext} = this.props;
        
        this.setState({showLoading:true});
	    var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.parentInfo["Surgery.surgeryDate"]+'/CancerGenePanel';
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
		   var path ='Patient/'+loginContext.mrn+'/Surgery/'+this.props.parentInfo["Surgery.surgeryDate"]+'/CancerGenePanel';
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
	       	this.setState({successMessage:'CancerGenePanel changes saved successfully'});
	       	this.setState({errorMessage:null});
	       } else {
	       	this.setState({errorMessage:'Failed to save CancerGenePanel changes'});
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
		return (  <div>
		            <PatientCardView
				    rows={this.getRows(topicName)}
		            saveClick={(event)=>this.onSave(event)}
					onChange={(...args) => this.onChange(...args)}
					onCancel={() => this.onCancel()}
		            onEditClick={onEditClick}
		            loginContext={this.props.loginContext}		
		            cardTitle={'Surgery('+this.props.parentInfo["Surgery.surgeryDate"]+')/'+topicName} 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}  
		            config={this.props.config}
		            />
		            
		            {this.state.showLoading == false && <TabMenu topicName={topicName} 
                     loginContext={this.props.loginContext}	
		             schema={loginContext.schema} 
		             grandParentId={this.props.parentInfo["Surgery.surgeryDate"]} 
		             parentId={this.state.patientInfo["CancerGenePanel.cgpPanelName"]}
		             parentKey={"Surgery.surgeryDate"}
            		 grandParentKey={"CancerGenePanel.cgpPanelName"}
		             mrn={this.props.mrn} 
        			 onEditClick={this.props.onEditClick}
        			 successMessage={this.props.successMessage}
        			 errorMessage={this.props.errorMessage}
		             config={this.props.config} 
		            />}
		         </div>   
		        );
	}
}