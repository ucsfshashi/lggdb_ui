import React from 'react';

import DemographicEdit from './demographic/view';
import DemographicView from './demographic/view'; 

import SurgeryEdit from './surgery/view'; 
import SurgeryView from './surgery/view'; 

import DiagnosisEdit from './diagnosis/view'; 
import DiagnosisView from './diagnosis/view'; 

import TumorEdit from './tumor/view'; 
import TumorView from './tumor/view'; 

import ClinicalEvaluationEdit from './clinicalEvaluation/view';
import ClinicalEvaluationView from './clinicalEvaluation/view'; 

import ImagingEdit from './imaging/view';
import ImagingView from './imaging/view'; 

export default class PatientRouter extends React.Component {

	constructor(props) {
		super(props);
	};
	
	getComponentName = (topicName,mode) => {
		switch(mode) {
	    	case 'edit':
	    		switch(topicName) {
	        		case 'Demographics': return DemographicEdit;
	        		case 'Surgery' : return SurgeryEdit;
	        		case 'Diagnosis' : return DiagnosisEdit;
	        		case 'Tumor' : return TumorEdit;
	        		case 'Imaging' : return ImagingEdit;
	        		case 'Clinical Evaluation' : return ClinicalEvaluationEdit;
	        		default: return DemographicView;
	        	}
	    	default:
	    		switch(topicName) {
	    			case 'Demographics': return DemographicView;
	    			case 'Surgery' : return SurgeryView;
	    			case 'Diagnosis' : return DiagnosisView;
	    			case 'Tumor' : return TumorView;
	    			case 'Imaging' : return ImagingView;
	    			case 'Clinical Evaluation' : return ClinicalEvaluationView;
	    			default: return DemographicView;
	    		}
	  	}
		return null;
	}
	render() { 
		const {topicName,mode} = this.props;
		const TagName = this.getComponentName(topicName,mode);
		
		return (
		  <TagName {...this.props} />
		);
	}
}
