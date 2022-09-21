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
  	
	componentDidMount(){
		this.extractData();
	};

	render() {
		const {topicName,loginContext,onEditClick,successMessage,errorMessage} = this.props;  
		return (  <Stack direction="column"
			  			justifyContent="space-around"
			  			alignItems="center"
			  			spacing={2}>
		            <PatientCardView
				    rows={this.getRows(topicName)}
		            loginContext={this.props.loginContext}
		            onEditClick={onEditClick}
		            cardTitle={'Surgery('+this.props.parentInfo["Surgery.surgeryDate"]+')/'+topicName} 
				    successMessage={successMessage}
				    errorMessage={errorMessage} 
		            loginContext={this.props.loginContext}	
		            patientInfo={this.state.patientInfo}
		            showLoading={this.state.showLoading}  
		            />
		            
		            {this.state.showLoading == false && <TabMenu topicName={topicName} 
                     loginContext={this.props.loginContext}	
                     parentId={this.state.patientInfo["CancerGenePanel.cgpPanelName"]}
                     grandParentId={this.props.parentInfo["Surgery.surgeryDate"]} 
            		 parentKey={"Surgery.surgeryDate"}
            		 grandParentKey={"CancerGenePanel.cgpPanelName"}
            		 mrn={this.props.mrn} 
        			 onEditClick={this.props.onEditClick}
        			 successMessage={this.props.successMessage}
        			 errorMessage={this.props.errorMessage}
		             config={this.props.config} 
		            />}
		            		            
		         </Stack>   
		        );
	}
}