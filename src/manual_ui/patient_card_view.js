import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from '@material-ui/icons/Edit';

import {Divider,Grid,Paper,Typography} from '@mui/material';

import FileView  from '../common/file_view'
import TagView  from '../common/tag_view'
import LinkView  from '../common/link_view'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';


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
	
		const { rows,cardTitle,onEditClick,successMessage,errorMessage,showLoading,patientInfo,config,loginContext} = this.props;
		
		
		
		return (
				
			<Paper elevation='1' >
			  <Stack spacing={2}>
				
				  <Grid container alignItems="center">
			          <Grid item xs>
			            <Typography gutterBottom variant="h4">
			              {cardTitle}
			            </Typography>
			          </Grid>
			          <Grid item>
			          		{  (loginContext && loginContext.selRole != "NON_PHI")  &&  (
			          				<EditIcon ontSize='large' color='primary' />
						          		 )
			          		}
			          </Grid>
		         </Grid>
			  { !showLoading && 
				 <Grid container 
			      direction="row"
			      spacing={1}>
				  {rows.map(function(field, index){
		              return (<Grid item  md={4} xs={4}>
		              <PatientLabelField
		                field={field}
		                value={patientInfo[0][field.className+'.'+field.id]} 
		                config={config}
		              />
		              </Grid>);
		          })}
				 </Grid> }
				  {
					  showLoading && 
					  <Grid container 
				            direction="row"
				            	alignContent='center'	
				            xs={12}	
				            spacing={10} >
					  		<Grid item  alignContent='center' xs={9}>
					  			{"Loading... "}
					  		</Grid>
					  		<Grid item  alignContent='center' xs={4}>
					  		</Grid>
					  		<Grid item  alignContent='center' xs={2}>
					           <CircularProgress/>
					        </Grid>
					   </Grid>  
				  }
				 
				 </Stack>	 
			 </Paper>
				 
		  );
	}
}