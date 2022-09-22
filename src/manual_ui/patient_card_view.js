import React from 'react';
import EditIcon from '@material-ui/icons/Edit';

import {Divider,Grid,Paper,Typography,LinearProgress,TextField,Stack,Box} from '@mui/material';

import InputForField from './patient_inputs';
import MUISaveButton from '../common/MUISaveButton'
import MUICancelButton from '../common/MUICancelButton'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';





export default class PatientCardView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	state = {
		showSave: false
	};
   

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
			  
			  	 { cardTitle instanceof Array &&
			  		<Breadcrumbs aria-label="breadcrumb">
			  	  	<Link variant="h5" underline="hover" color="inherit"  href="#" onClick={(event,topic)=>this.props.goBackToList(null,cardTitle[0].topic)}>
			  	        {cardTitle[0].topic}{'('+cardTitle[0].value+')'}
			  	     </Link>
			  	   <Typography variant="h5" color="text.primary">{cardTitle[1].topic}</Typography>
			  	</Breadcrumbs>	 	
			  	 }
			  	{ !(cardTitle instanceof Array) &&
			  	 <Typography variant="h5" color="text.primary">{cardTitle}</Typography>
			  	}
		         
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