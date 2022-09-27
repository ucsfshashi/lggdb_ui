import React from 'react';

import DemographicEdit from './demographic/view';
import DemographicView from './demographic/view'; 

import SurgeryEdit from './surgery/edit'; 
import SurgeryView from './surgery/view'; 

import DiagnosisEdit from './diagnosis/edit'; 
import DiagnosisView from './diagnosis/view'; 

import TumorEdit from './tumor/edit'; 
import TumorView from './tumor/view'; 

import ClinicalEvaluationEdit from './clinicalEvaluation/edit';
import ClinicalEvaluationView from './clinicalEvaluation/view'; 

import ImagingEdit from './imaging/edit';
import ImagingView from './imaging/view'; 

import LoglioCognitiveEdit from './loglioCognitive/edit';
import LoglioCognitiveView from './loglioCognitive/view';

import QOLEdit from './qol/edit';
import QOLView from './qol/view'; 

import ChemotherapyEdit from './chemotherapy/edit';
import ChemotherapyView from './chemotherapy/view'; 

import RadiotherapyEdit from './radiotherapy/edit';
import RadiotherapyView from './radiotherapy/view'; 

import MedicationEdit from './medication/edit';
import MedicationView from './medication/view'; 

import EpidemiologyEdit from './epidemiology/view';
import EpidemiologyView from './epidemiology/view'; 

import ClinicalTrialEdit from './clinicalTrial/edit';
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


import AttentionView from './attention/view';
import AttentionEdit from './attention/edit';


import PastMedicalHistoryView from './pastMedicalHistory/view';
import PastMedicalHistoryEdit from './pastMedicalHistory/view';

import QABEdit from './qab/edit';
import QABView from './qab/view'; 


import WakefulnessEdit from './wakefulness/edit';
import WakefulnessView from './wakefulness/view'; 


import LanguageEdit from './language/edit';
import LanguageView from './language/view'; 


import McGurkEdit from './mcGurk/edit';
import McGurkView from './mcGurk/view'; 

import SensoryEdit from './sensory/edit';
import SensoryView from './sensory/view'; 


import CognitionEdit from './cognition/edit';
import CognitionView from './cognition/view'; 

import ImageGuidedTissueView from './imageGuidedTissue/view'; 
import ImageGuidedTissueEdit from './imageGuidedTissue/edit';


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
	        		case 'Attention': return AttentionEdit;
	        		case 'Past Medical History': return PastMedicalHistoryEdit;
	        		case 'QAB': return QABEdit;
	        		case 'Wakefulness': return WakefulnessEdit;
	        		case 'Language': return LanguageEdit;
	        		case 'McGurk': return McGurkEdit;
	        		case 'Sensory': return SensoryEdit;
	        		case 'Cognition': return CognitionEdit;
	        		case 'Image Guided Tissue': return ImageGuidedTissueEdit;
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
	    			case 'Attention': return AttentionView;
	    			case 'Past Medical History': return PastMedicalHistoryView;
	    			case 'QAB': return QABView;
	    			case 'Wakefulness': return WakefulnessView;
	    			case 'Language': return LanguageView;
	    			case 'McGurk': return McGurkView;
	    			case 'Sensory': return SensoryView;
	    			case 'Cognition': return CognitionView;
	    			case 'Image Guided Tissue': return ImageGuidedTissueView;
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
