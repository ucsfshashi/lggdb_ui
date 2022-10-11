import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";

export default class TumorRadiotherapyEdit extends React.Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	       data: this.props.data,
    	   showLoading:false,
    	   isNewPatient:(this.props.data['Radiotherapy.radiotherapyStartDate'] == undefined)
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
		   var data = this.state.data;
	       var path ='Patient/'+loginContext.mrn+'/PatientTumor/'+this.props.parentInfo["PatientTumor.tumorLabel"]+'/Radiotherapy/'+data["Radiotherapy.radiotherapyStartDate"]+'/TumorRadioTheraphy';
	       
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
	    	    this.setState({successMessage:'TumorRadiotherapy changes saved successfully'});
	        	this.setState({errorMessage:null});
	        	this.props.goBackToList(null);
	        	
	       } else {
	    	   this.setState({errorMessage:'Failed to save TumorRadiotherapy changes'});
	           this.setState({successMessage:null});
	       }
	
	       this.setState({showLoading:false});
        
        
	};
	
	 onCancel = () => {
			this.props.goBackToList(null);
		};
	getRows  = (topicName) => {
		var rows = this.props.loginContext.schema.filter(el => (el.topic === topicName
				   || (el.className === "Radiotherapy" && el.id ==="radiotherapyStartDate")) );
			
			if(rows[rows.length-1].className === 'Radiotherapy') {
				rows[rows.length-1].type='singleSel';
				
				if(this.state.radioTherapyDates)  {
					rows[rows.length-1].values=this.state.radioTherapyDates;
				}
			}
			this.arraymove(rows,rows.length-1,0);
		
			return rows;
	};
	
	
	arraymove = (arr,fromIndex,toIndex) => {
	    var element = arr[fromIndex];
	    arr.splice(fromIndex, 1);
	    arr.splice(toIndex, 0, element);
	};
	
	async extractData () {
	       
		const {config,mrn,loginContext} = this.props;
        this.setState({showLoading:true});
        var path ='Patient/'+loginContext.mrn+'/Radiotherapy';
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
        
        
        if(patientInfo) {
        	patientInfo = patientInfo.data;
        }
        
        
        var radioTherapyDates =[];
        radioTherapyDates.push('Select');
        for(var index in patientInfo) {
        	radioTherapyDates.push(patientInfo[index]['Radiotherapy.radiotherapyStartDate']); 
        }
        
        this.setState({showLoading:false,radioTherapyDates:radioTherapyDates});
   };
	
	componentDidMount(){
		this.extractData();
		
   };
	
	
	
	
	render() {
		const {topicName,onChange,data} = this.props;  
		
		return (<PatientCardView
			    rows={this.getRows(topicName)}
				fromList={true}
				patientInfo={this.state.data}
				loginContext={this.props.loginContext}
		        onChange={(...args) => this.onChange(...args)}
			    successMessage={this.state.successMessage}
			    isNewPatient={this.state.isNewPatient}
				keyColumn={'radiotherapyStartDate'}
			    errorMessage={this.state.errorMessage} 
		        saveClick={(event)=>this.onSave(event)}
				cardTitle={[{"topic":"Tumor","value":this.props.parentInfo["PatientTumor.tumorLabel"]},{"topic":topicName,"value":this.props.data['Radiotherapy.radiotherapyStartDate']}]}	
		        showLoading={this.state.showLoading}	
				onCancel={() => this.onCancel()} 	
		/>);
	}
}