import React from 'react';

import DemographicEdit from './demographic/view';
import DemographicView from './demographic/view'; 

import SurgeryEdit from './surgery/edit'; 
import SurgeryView from './surgery/view'; 

import DiagnosisEdit from './diagnosis/edit'; 
import DiagnosisView from './diagnosis/view'; 

import TumorEdit from './tumor/edit'; 
import TumorView from './tumor/view'; 

import ClinicalEvaluationEdit from './clinicalEvaluation/view';
import ClinicalEvaluationView from './clinicalEvaluation/view'; 

import ImagingEdit from './imaging/edit';
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

import CancerGenePanelEdit from './cancerGenePanel/view';
import CancerGenePanelView from './cancerGenePanel/view';


import TissueEdit from './tissue/edit';
import TissueView from './tissue/view';


import ResearchPathologyView from './researchPathology/view';
import ResearchPathologyEdit from './researchPathology/view';


import ClinicalPathologyView from './clinicalPathology/view';
import ClinicalPathologyEdit from './clinicalPathology/view';

import UCSF500View from './ucsf500/view';
import UCSF500Edit from './ucsf500/view';

import AlterationRowView from './alterationRow/view';
import AlterationRowEdit from './alterationRow/edit';

import CopyNumberChangeRowView from './copyNumChangeRow/view';
import CopyNumberChangeRowEdit from './copyNumChangeRow/edit';




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
	        		case 'CancerGenePanel' : return CancerGenePanelEdit;
	        		case 'Tissue' : return TissueEdit;
	        		case 'Research Pathology': return ResearchPathologyEdit;
	        		case 'Clinical Pathology' : return ClinicalPathologyEdit;
	        		case 'UCSF500' : return UCSF500Edit;
	        		case 'Alteration Row' : return AlterationRowEdit;
	        		case 'Copy Number Change Row' : return CopyNumberChangeRowEdit;
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
	    			case 'CancerGenePanel' : return CancerGenePanelView;
	    			case 'Tissue' : return TissueView;
	    			case 'Research Pathology': return ResearchPathologyView;
	    			case 'Clinical Pathology' : return ClinicalPathologyView;
	    			case 'UCSF500' : return UCSF500View;
	    			case 'Alteration Row' : return AlterationRowView;
	    			case 'Copy Number Change Row' : return CopyNumberChangeRowView;
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
