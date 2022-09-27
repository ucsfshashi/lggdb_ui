import React from 'react';

import {Divider,Grid,Paper,Typography,LinearProgress,TextField,Stack,Box} from '@mui/material';

import InputForField from './patient_inputs';
import MUISaveButton from '../common/MUISaveButton'
import MUICancelButton from '../common/MUICancelButton'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import Iconify from '../components/Iconify';

export default class PatientCardView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
		showSave: false
	};
   
	
	getTopicIcon=(topicName) => {
		const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
		var icon = this.props.loginContext.schema.filter(el => el.topic == topicName)[0];
		return icon ? getIcon("fa:"+icon.icon) : null;
	}
	
	getTitle = (cardTitle) => {
		if(cardTitle instanceof Array) {
	  		return (<Breadcrumbs aria-label="breadcrumb">
	  		<Stack direction="row" alignItems="center" gap={1}>	
	  		{this.getTopicIcon(cardTitle[0].topic)}
	  		<Link variant="h5" underline="hover" color="inherit"  href="#" onClick={(event,topic)=>this.props.goBackToList(null,cardTitle[0].topic)}>
	  	       {cardTitle[0].topic}{'('+cardTitle[0].value+')'}
	  	     </Link>
	  	   </Stack>
	  	   
	  	   <Stack direction="row" alignItems="center" gap={1}>
	  	   	{this.getTopicIcon(cardTitle[1].topic)} 
	  	   	<Typography variant="h5" color="text.primary">{cardTitle[1].topic}</Typography>
	  	   </Stack>
	  	   </Breadcrumbs> );	 	
	  	}
		else
		{
	  	 return (<Stack direction="row" alignItems="center" gap={1}>
	  	 			{this.getTopicIcon(cardTitle)} 
	  	 			<Typography variant="h5" color="text.primary">{cardTitle}</Typography>
	  	 		</Stack>);
	  	}
	}

	render() {  
	
		const { rows,cardTitle,saveClick,successMessage,errorMessage,showLoading,patientInfo,config,keyColumn,isNewPatient,loginContext} = this.props;
		
		const onChange =(field,value) => {
			this.props.onChange(field.className,field.id,value);
			this.setState({showSave:true});
		};	
		
		const onCancel =(event) => {
			this.props.onCancel();
			this.setState({showSave:false});
		};	
		
		const onSave =(event) => {
			this.props.saveClick(event);
			this.setState({showSave:false});
		};	
		
		return (
				
			<Paper elevation='1' >
			
			  <Stack spacing={3}>
			  <Stack direction="row"
				  justifyContent="space-between"
				  alignItems="center"
				  spacing={1}>
			  
			  	 {this.getTitle(cardTitle)}
			  	  { successMessage &&
		             <Typography  sx={{ paddingTop: '10px',paddingLeft: '15px' }} variant="h5">
		  	  	         {successMessage}
		             </Typography>
		             }
		             { errorMessage &&
			             <Typography  sx={{ paddingTop: '10px',paddingLeft: '15px' }} variant="h5">
			  	  	         {errorMessage}
			             </Typography>
			         }
		             
		             <Typography  sx={{ paddingTop: '10px',paddingRight: '25px' }} variant="h5">
		  	  	  	{  (loginContext && loginContext.selRole != "NON_PHI") && this.state.showSave &&  (
		  	  	  			<div>
		  	  	  				<MUISaveButton  onSaveClick={(event)=>onSave(event)}   />
		  	  	  				<MUICancelButton onCancelClick={(event)=>onCancel(event)}    />
		  	  	  			</div>
		  	  	  		)
	          		}
		  	  	 </Typography>
	         </Stack>
			 <Stack >    
		         {!showLoading &&
		      	 <Grid container 
			      direction="row"
			      spacing={1}>
				  {rows.map(function(field, index){
		              return (<Grid item  md={4} xs={4}>
		              <InputForField
		              field={field}
		              disabled={(isNewPatient === false && keyColumn && ( field.editable == false || field.id ===keyColumn || keyColumn.indexOf(field.id) != -1) )}
		              onChange={(field,value) =>onChange(field,value)}
		              value={patientInfo[field.className+'.'+field.id]} 
		              loginContext={loginContext}
		              successMessage={successMessage}
		              isNewPatient={isNewPatient}
		              errorMessage={errorMessage}
		              config={config}
		              />
		              </Grid>);
		          })}
				 </Grid> 
		         }
				 {showLoading  && <LinearProgress />}
				 </Stack>   
				</Stack>	 
			 </Paper>
				 
		  );
	}
}