import React from 'react';
import EditIcon from '@material-ui/icons/Edit';

import {Divider,Grid,Paper,Typography,LinearProgress,TextField,Stack,Box} from '@mui/material';

import FileView  from '../common/file_view'
import TagView  from '../common/tag_view'
import LinkView  from '../common/link_view'
import InputForField from './patient_inputs';



function PatientLabelField({field, value,config}) {
	  value = value || '';
	  return (
			<div>
			   <TextField
	          id={field.id}
	          label={field.displayName}
	          defaultValue={value ? value :' '}
	          InputProps={{
	            readOnly: true,
	          }}
	        />
			</div>
	  );
}


export default class PatientCardView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	

	render() {  
	
		const { rows,cardTitle,onEditClick,successMessage,errorMessage,showLoading,patientInfo,config,keyColumn,isNewPatient,onChange,data,loginContext} = this.props;
		
		
		
		return (
				
			<Paper elevation='1' >
			
			  <Stack spacing={3}>
			  <Stack direction="row"
				  justifyContent="space-between"
				  alignItems="center"
				  spacing={1}>
		  	  	  	  <Typography  variant="h5">
		              {cardTitle}
		            </Typography>
		  	  	  	{  (loginContext && loginContext.selRole != "NON_PHI")  &&  (
	          				<EditIcon ontSize='large' color='primary' />
				          		 )
	          		}
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
		              value={patientInfo[0][field.className+'.'+field.id]} 
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