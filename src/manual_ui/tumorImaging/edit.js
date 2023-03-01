import React from 'react';
import PatientCardView from '../patient_card_view';
import axios from "axios";

export default class TumorImagingEdit extends React.Component {
	
	constructor(props) {
	    super(props);
	    
	    this.state = {
	       data: this.props.data,
    	   showLoading:false,
    	   isNewPatient:(this.props.data['Imaging.imagingDate'] == undefined)
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
		   var path ='Patient/'+loginContext.mrn+'/PatientTumor/'+this.props.parentInfo["PatientTumor.tumorLabel"]+'/Imaging/'+data["Imaging.imagingDate"]+'/TumorImage';
	       
	       const headers = { 
	    		   'Content-Type' :'applicaiton/json',
	               'X-Requested-With':'XMLHttpRequest', 
	               'UCSFAUTH-TOKEN':loginContext.token,
	                'tagId':loginContext.selTag.tagId,
	                 'selRole':loginContext.selRole,
	                 'Content-Type': 'application/json'
	    		};
	       var rInfo = await axios.post(loginContext.apiUrl+"/patientinfo/"+path, JSON.stringify(data), { headers });
	       
	       if(rInfo && rInfo.data === true) {
	    	    this.setState({successMessage:'TumorImaging changes saved successfully'});
	        	this.setState({errorMessage:null});
	        	this.props.goBackToList(null);
	        	
	       } else {
	    	   this.setState({errorMessage:'Failed to save TumorImaging changes'});
	           this.setState({successMessage:null});
	       }
	
	       this.setState({showLoading:false});
        
        
	};
	
	 onCancel = () => {
			this.props.goBackToList(null);
		};
	getRows  = (topicName) => {
		var rows = this.props.loginContext.schema.filter(el => (el.topic === topicName
				   || (el.className === "Imaging" && el.id ==="imagingDate")) );
			
			if(rows[rows.length-1].className === 'Imaging') {
				rows[rows.length-1].type='singleSel';
				
				if(this.state.imgDates)  {
					rows[rows.length-1].values=this.state.imgDates;
				}
				
				this.arraymove(rows,rows.length-1,0);
			}
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
        var path ='Patient/'+loginContext.mrn+'/Imaging';
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
        	patientInfo = patientInfo.data;
        }
        
        var imgDates =[];
        imgDates.push('Select');
        for(var index in patientInfo) {
        	imgDates.push(patientInfo[index]['Imaging.imagingDate']); 
        }
        
         
        this.setState({showLoading:false,imgDates:imgDates});
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
				keyColumn={'imagingDate'}
			    errorMessage={this.state.errorMessage} 
		        saveClick={(event)=>this.onSave(event)}
				cardTitle={[{"topic":"Tumor","value":this.props.parentInfo["PatientTumor.tumorLabel"]},{"topic":topicName,"value":this.props.data['Imaging.imagingDate']}]}	
		        showLoading={this.state.showLoading}	
				onCancel={() => this.onCancel()} 	
		/>);
	}
}