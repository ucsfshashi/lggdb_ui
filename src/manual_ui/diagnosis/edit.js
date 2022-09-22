import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";

export default class DiagnosisEdit extends React.Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	       data: this.props.data,
    	   showLoading:false,
    	   isNewPatient:(this.props.data && this.props.data['Diagnosis.diagnosisDate'] == undefined)
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
		   var path ='Patient/'+loginContext.mrn+'/Diagnosis';
		   var data = this.state.data;
	       
		   if(data["Surgery.surgeryDate"] && data["Surgery.surgeryDate"] != 'None' ) {
	        	path = 'Patient/'+loginContext.mrn+'/Surgery/'+data["Surgery.surgeryDate"]+'/Diagnosis';
	        }
	       
	       const headers = { 
	    		   'Content-Type' :'applicaiton/json',
	               'X-Requested-With':'XMLHttpRequest', 
	               'UCSFAUTH-TOKEN':loginContext.token,
	                'tagId':loginContext.selTag.tagId,
	                 'selRole':loginContext.selRole,
	                 'Content-Type': 'application/json'
	    		};
	       var rInfo = await axios.post("https://btcdb-test.ucsf.edu/api/patientinfo/"+path, JSON.stringify(data), { headers });
	       
	       if(rInfo && rInfo.data === true) {
	    	    this.setState({successMessage:'Diagnosis changes saved successfully'});
	        	this.setState({errorMessage:null});
	        	this.props.goBackToList(null);
	        	
	       } else {
	    	   this.setState({errorMessage:'Failed to save Diagnosis changes'});
	           this.setState({successMessage:null});
	       }
	
	       this.setState({showLoading:false});
	};
	
	arraymove = (arr,fromIndex,toIndex) => {
	    var element = arr[fromIndex];
	    arr.splice(fromIndex, 1);
	    arr.splice(toIndex, 0, element);
	};
	
	
	async extractSurgeryInfo() {
		
		const {config,mrn,loginContext} = this.props;
        this.setState({showLoading:true});
        var path ='Patient/'+loginContext.mrn+'/Surgery';
        var surgeryInfo = await axios.get("https://btcdb-test.ucsf.edu/api/patientinfo/"+path, 
                                    {headers:{
                                      'Content-Type' :'applicaiton/json',
                                      'X-Requested-With':'XMLHttpRequest', 
                                      'UCSFAUTH-TOKEN':loginContext.token,
                                       'tagId':loginContext.selTag.tagId,
                                        'selRole':loginContext.selRole,
                                        'Accept': 'application/json',
                                    }}
                                    );
        
        if(surgeryInfo) {
        	surgeryInfo = surgeryInfo.data;
        }
		
        var surgeryDates =[];
        surgeryDates.push('None');
        for(var index in surgeryInfo) {
        	surgeryDates.push(surgeryInfo[index]['Surgery.surgeryDate']); 
        }
        
        this.setState({showLoading:false,surgeryDates:surgeryDates});
   };
	
	componentDidMount(){
		this.extractSurgeryInfo();
	};
	
	getRows  = () => {
		var rows = this.props.loginContext.schema.filter(el => (el.topic === this.props.loginContext.topic
				   || (el.className === "Surgery" && el.id ==="surgeryDate")) );
			
			if(rows[0].className === 'Surgery') {
				rows[0].type='singleSel';
				
				if(this.state.surgeryDates)  {
					rows[0].values=this.state.surgeryDates;
				}
				this.arraymove(rows,0,rows.length-2);
			}
			
			return rows;
	};
	render() {
		const {onChange} = this.props;  
	
		return (<PatientCardView
			    rows={this.getRows()}
			    patientInfo={this.state.data}
		        loginContext={this.props.loginContext}
		        onChange={(...args) => this.onChange(...args)}
			    successMessage={this.state.successMessage}
			    isNewPatient={this.state.isNewPatient}
		        keyColumn={'diagnosisDate'}
			    errorMessage={this.state.errorMessage} 
		        saveClick={(event)=>this.onSave(event)}
		        cardTitle={this.props.loginContext.topic}
		        showLoading={this.state.showLoading}	
		        onCancelClick={this.props.onCancelClick}
		        />);
	}
}