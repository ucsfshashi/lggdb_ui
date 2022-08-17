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

import LoglioCognitiveEdit from './loglioCognitive/view';
import LoglioCognitiveView from './loglioCognitive/view';

import QOLEdit from './qol/view';
import QOLView from './qol/view'; 

import ChemotherapyEdit from './chemotherapy/view';
import ChemotherapyView from './chemotherapy/view'; 

import RadiotherapyEdit from './radiotherapy/view';
import RadiotherapyView from './radiotherapy/view'; 

import MedicationEdit from './medication/view';
import MedicationView from './medication/view'; 

import EpidemiologyEdit from './epidemiology/view';
import EpidemiologyView from './epidemiology/view'; 

import ClinicalTrialEdit from './clinicalTrial/view';
import ClinicalTrialView from './clinicalTrial/view';

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
	        		case 'Loglio cognitive': return LoglioCognitiveEdit;
	        		case 'QOL': return QOLEdit;
	        		case 'Chemotherapy' : return ChemotherapyEdit;
	        		case 'Radiotherapy' : return RadiotherapyEdit;
	        		case 'Medication' : return MedicationEdit;
	        		case 'Epidemiology' : return EpidemiologyEdit;
	        		case 'Clinical Trial' : return ClinicalTrialEdit;
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
	    			case 'Loglio cognitive': return LoglioCognitiveView;
	    			case 'QOL': return QOLView;
	    			case 'Chemotherapy' : return ChemotherapyView;
	    			case 'Radiotherapy' : return RadiotherapyView;
	    			case 'Medication' : return MedicationView;
	    			case 'Epidemiology' : return EpidemiologyView;
	    			case 'Clinical Trial' : return ClinicalTrialView;
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
