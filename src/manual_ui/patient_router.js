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


import CgpAlterationRowView from './cgpAlterationRow/view';
import CgpAlterationRowEdit from './cgpAlterationRow/edit';

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


import TumorObservationsEdit from './tumorObservations/edit';
import TumorObservationsView from './tumorObservations/view'; 

import TumorSurgeryEdit from './tumorSurgery/edit';
import TumorSurgeryView from './tumorSurgery/view'; 


import TumorImagingEdit from './tumorImaging/edit';
import TumorImagingView from './tumorImaging/view'; 


import TumorRadiotherapyEdit from './tumorRadiotherapy/edit';
import TumorRadiotherapyView from './tumorRadiotherapy/view'; 


import ExecutiveFrontalEdit from './executiveFrontal/view';
import ExecutiveFrontalView from './executiveFrontal/view'; 

import EmotionalCopingEdit from './emotionalCoping/view';
import EmotionalCopingView from './emotionalCoping/view'; 

import AuditoryAttentionEdit from './auditoryAttention/view';
import AuditoryAttentionView from './auditoryAttention/view'; 

import ProcessingSpeedEdit from './processingSpeed/view';
import ProcessingSpeedView from './processingSpeed/view'; 

import LearningMemoryEdit from './learningMemory/view';
import LearningMemoryView from './learningMemory/view'; 


import BloodDrawEdit from './bloodDraw/edit';
import BloodDrawView from './bloodDraw/view'; 


import MRIEdit from './mri/edit';
import MRIView from './mri/view'; 


export default class PatientRouter extends React.Component {

	constructor(props) {
		super(props);
	};
	
	getComponentName = (topicName,mode) => {
		switch(mode) {
	    	case 'edit':
	    		switch(topicName) {
	        		case 'Demographics': return DemographicEdit;
	        		case 'Tumor' : return TumorEdit;
	        		case 'Surgery' : return SurgeryEdit;
	        		case 'Chemotherapy' : return ChemotherapyEdit;
	        		case 'Clinical Evaluation' : return ClinicalEvaluationEdit;
	        		case 'Imaging' : return ImagingEdit;
	        		case 'Radiotherapy' : return RadiotherapyEdit;
	        		case 'Medication' : return MedicationEdit;
	        		case 'Clinical Trial' : return ClinicalTrialEdit;
	        		case 'Epidemiology' : return EpidemiologyEdit;
	        		case 'Past Medical History': return PastMedicalHistoryEdit;
	        		case 'Diagnosis' : return DiagnosisEdit;
	        		case 'Clinical Pathology' : return ClinicalPathologyEdit;
	        		case 'UCSF500' : return UCSF500Edit;
	        		case 'Alteration Row' : return AlterationRowEdit;
	        		case 'Copy Number Change Row' : return CopyNumberChangeRowEdit;
	        		case 'CancerGenePanel' : return CancerGenePanelEdit;
	        		case 'CgpAlterationRow' : return CgpAlterationRowEdit;
	        		case 'Tumor Observation': return TumorObservationsEdit;
	        		case 'Tumor Surgery': return TumorSurgeryEdit;
	        		case 'Tumor Imaging': return TumorImagingEdit;
	        		case 'Tumor Radiotherapy': return TumorRadiotherapyEdit;
	        		case 'Research Pathology': return ResearchPathologyEdit;
	        		case 'Tissue' : return TissueEdit;
	        		case 'Loglio cognitive': return LoglioCognitiveEdit;
	        		case 'QOL': return QOLEdit;
	        		case 'Attention': return AttentionEdit;
	        		case 'QAB': return QABEdit;
	        		case 'Wakefulness': return WakefulnessEdit;
	        		case 'Language': return LanguageEdit;
	        		case 'McGurk': return McGurkEdit;
	        		case 'Sensory': return SensoryEdit;
	        		case 'Cognition': return CognitionEdit;
	        		case 'Image Guided Tissue': return ImageGuidedTissueEdit;
	        		case 'Executive and Frontal systems': return ExecutiveFrontalEdit;
	        		case 'Emotional coping': return EmotionalCopingEdit;
	        		case 'Auditory Attention and Concentration': return AuditoryAttentionEdit;
	        		case 'Processing speed and Language': return ProcessingSpeedEdit;
	        		case 'Verbal and Visual Learning memory': return LearningMemoryEdit;
	        		case 'BloodDraw': return BloodDrawEdit;
	        		case 'MRI': return MRIEdit;
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
	    			case 'CgpAlterationRow' : return CgpAlterationRowView;
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
	    			case 'Tumor Observation': return TumorObservationsView;
	    			case 'Tumor Surgery': return TumorSurgeryView;
	    			case 'Tumor Imaging': return TumorImagingView;
	    			case 'Tumor Radiotherapy': return TumorRadiotherapyView;
	    			case 'Executive and Frontal systems': return ExecutiveFrontalView;
	        		case 'Emotional coping': return EmotionalCopingView;
	        		case 'Auditory Attention and Concentration': return AuditoryAttentionView;
	        		case 'Processing speed and Language': return ProcessingSpeedView;
	        		case 'Verbal and Visual Learning memory': return LearningMemoryView;
	        		case 'BloodDraw': return BloodDrawView;
	        		case 'MRI': return MRIView;
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
