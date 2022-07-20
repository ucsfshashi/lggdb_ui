import React from 'react';
import {createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
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

function PatientLabelField({field, value,config}) {
	  value = value || '';
	  return (
		<div className="loglio-input-div" >	  
		<label className="loglio-input-label">
	      <div className="label-text">{field.displayName}</div>
	     
	      {field.type == 'file' ? <FileView config={config} value={value} displayName={field.displayName} /> : 
	    	 ( field.type == 'link' ? <LinkView value={value}  /> :
	    	   (field.id == 'tags'  ? <TagView config={config} value={value} displayName={field.displayName} /> : (<div className="value-text">
	    	      {value?value:'---'}
		    		</div>) 
	    			   )
	          )
	    		      
	    	}
	   
	      </label>
	    </div>
	  );
}


export default class PatientCardView extends React.Component {
	
	constructor(props) {
	    super(props);
	};
	
	getMuiTheme = () => createMuiTheme({
		overrides: {
			MuiPaper : {
				root :{
					    marginLeft: '-25px',
					    width: '100%',
					    padding : '5px',
					    minHeight: '500px',
					    fontFamily: 'Helvetica Light',
					    marginTop: '-14px',
					  }
			},
			MuiSvgIcon :{
		    	root:{
		    		fontSize: '2.5rem'
		    	} 	
		    },
		    MuiTypography:{
		    	h4:{
	    		 fontSize:'3.3rem',
	    		 letterSpacing:'0.03em',
	    		 fontFamily:'Helvetica Light'		
		    	}
		    },
		}
	});	

	render() {  
	
		const { rows,cardTitle,onEditClick,successMessage,errorMessage,showLoading,patientInfo,config,loginContext} = this.props;
		
		
		
		return (
				<MuiThemeProvider theme={this.getMuiTheme()}>
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
				 <Divider variant="middle" variant='middle' />
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
				 </MuiThemeProvider>
		  );
	}
}