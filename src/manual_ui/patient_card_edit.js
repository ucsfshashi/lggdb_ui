import React from 'react';
import InputForField from './patient_inputs';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

export default class PatientCardEdit extends React.Component {
	
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
		    MuiCircularProgress :{
		    	root :{
	    		    top: 5,
	    		    left: 5,
	    		    zIndex: 1,
	    		    position:'absolute'
		    	}
			},
			MuiTypography : {
				colorPrimary :{
					color: '#f9f1f1',
					backgroundColor: 'green',
			    	borderRadius: '4px',
			    	height: '30px',
			    	paddingLeft: '30px',
			    	paddingTop: '5px'
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
	
		const {rows,cardTitle, associationKey,config, 
			isNewPatient, successMessage,data,keyColumn,errorMessage,saveClick} = this.props;
		
		const onChange =(field,value) => {
			this.props.onChange(field.className,field.id,value);
		};	
			
		return (
				<MuiThemeProvider theme={this.getMuiTheme()}>
				  <Paper elevation='0' >
				 
				  <Grid container alignItems="center">
			          <Grid item xs>
			            <Typography gutterBottom variant="h4">
			              {cardTitle}
			            </Typography>
			          </Grid>
			          <Grid item xs>
			            { this.props.successMessage && 
				          <Typography gutterBottom variant="h6" color='primary' >
			                     {this.props.successMessage}
			               </Typography>
				        }
			            { this.props.errorMessage && 
				          <Typography gutterBottom variant="h6" color='error' >
			                     {this.props.errorMessage}
			               </Typography>
					    }
			          </Grid>
			          <Grid item>
			            { this.props.successMessage && 
			             <IconButton>
	                       <CheckCircleOutlineIcon fontSize='large' color='action' 
	            			   onClick={(event)=>this.props.onCancelClick(event)} 
	                        />
	                     </IconButton>
			            }
		                <IconButton disabled={this.props.showLoading} >
		                   <SaveIcon fontSize='large' color={this.props.showLoading?'inherit':'primary'}  
	            			  onClick={(event)=>this.props.saveClick(event)} 
		                   />
			                { this.props.showLoading &&   
				            	<CircularProgress size={50} />
					        }
	            		</IconButton>   
	            		<IconButton>
	            		   <CancelIcon fontSize='large' color='inherit' 
	            			   onClick={(event)=>this.props.onCancelClick(event)} />
	            	     </IconButton>
	                </Grid>
		         </Grid>
				 <Divider variant="middle" variant='middle' />
				 <Grid container 
			      direction="row"
			      spacing={1}>
				  {rows.map(function(field, index){
		              return (<Grid item  md={4} xs={4}>
		              <InputForField
		              field={field}
		              disabled={(isNewPatient === false && keyColumn && ( field.editable == false || field.id ===keyColumn || keyColumn.indexOf(field.id) != -1) )}
		              onChange={(field,value) =>onChange(field,value)}
		              value={data[field.className+'.'+field.id]} 
		              successMessage={successMessage}
		              isNewPatient={isNewPatient}
		              errorMessage={errorMessage}
		              config={config}
		              />
		              </Grid>);
		          })}
				 </Grid> 
				 </Paper>
				 </MuiThemeProvider>
		  );
	}
}