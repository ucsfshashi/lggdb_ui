import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FileView  from '../common/file_view'
import TagView  from '../common/tag_view'
import LinkView  from '../common/link_view'
import TextField from '@mui/material/TextField';



function PatientLabelField({field, value,config}) {
	  value = value || '';
	  return (
			<div>
			   <TextField
	          id="outlined-read-only-input"
	          label="HELLO HI HELLO HI HELLO HI"
	          defaultValue={value}
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
				
				<Paper elevation='0' >
				 
				  <Grid container alignItems="center">
			          <Grid item xs>
			            <Typography gutterBottom variant="h4">
			              {cardTitle}
			            </Typography>
			          </Grid>
			          <Grid item>
			          		{  (loginContext && loginContext.selRole != "NON_PHI")  &&  (
			          				<IconButton onClick={(event)=>this.props.onEditClick(event, patientInfo[0])} >
				          			<EditIcon ontSize='large' color='primary' />
					            </IconButton> )
			          		}
			          </Grid>
		         </Grid>
				 <Divider variant="middle" />
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
				 </Paper>
				 
		  );
	}
}