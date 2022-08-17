import React from 'react';
import {createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import {Button} from '@mui/material';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MUIDataTable from "mui-datatables";
import MUIAddButton from '../common/MUIAddButton'
import ChildMenu from './child_menu'


export default class PatientListView extends React.Component {
	
	constructor(props) {
	    super(props);
	};

	
	
	getOptions =() =>{
		var options = {};
		options.fixedHeader = true;
		options.print =false;
		options.pagination = false;
		options.responsive='scroll';
		options.selectableRows = 'none';
		options.filterType='multiselect';
		options.download=false;
		options.search=false;
		
		
		if(this.isNonPHI()) {
			options.customToolbar= () => {
		        return (
		         <MUIAddButton onAddClick={(event)=>this.props.onEditClick(event,{})}    />
		        );
		      };
		}
		
		
		return options;
	};
	
	isNonPHI = () => {
		return (this.props.loginContext && this.props.loginContext.selRole != "NON_PHI");
	};
	
	getColumns = () => {
		var columns = [];
	     var _this = this;
		var options = {}
		
		if(this.isNonPHI()) {
			options.customBodyRender = (value, tableMeta, updateValue) => {
				return (
					<Button onClick={(event)=>this.props.onEditClick(event,_this.props.patientInfo[tableMeta.rowIndex])} >
	            		<EditIcon ontSize='small' />
	            	</Button>
	           );
			};
		}
		
		options.filter=false;
	   
		
		columns.push({
	    	  name: 'rowAction',
	    	  label:' ',
	    	  text: ' '
	    });
		columns[0].options = options;
		
		
		if(this.props.childTopics && this.props.childTopics.length > 0) {
			var childOptions = {}
			
		       childOptions.customBodyRender = (value, tableMeta, updateValue) => {
					return (
					  <ChildMenu onNavigateClick={this.props.onNavigateClick} 
					             parentInfo={this.props.patientInfo[tableMeta.rowIndex]} 
					  			 grandInfo={this.props.grandInfo} 	
					             childTopics={this.props.childTopics}
					  			 loginContext={this.props.loginContext} />
		           );
				};
	
			columns.push({
		    	  name: 'childs',
		    	  label:' ',
		    	  text: ' '
		    });
			childOptions.filter=false;
			columns[1].options =  childOptions;
		}
		
		
		this.props.rows.forEach(
				function(elem){
					columns.push({
				    	  name: elem.className+'_'+elem.id,
				    	  label:elem.displayName,
				    	  text: elem.displayName
				     	});
					});
		return columns;
	};
	
	convertPatientInfo = (pInfo) => {

		var pList = [];
		
		if(pInfo) {
			for(var index in pInfo) {
				pList.push(this.convertInfo(pInfo[index]));
			}
		}
		return pList;
	}
	
	convertInfo =(ele) => {
		var info = {};
		
		for(var i  in ele) {
			info[i.replace('.','_')] = ele[i];
		}
		
		return info;
	}
	
	getPatientInfo = () => {
	  return this.convertPatientInfo(this.props.patientInfo);
	}

	render() {  
	
		const { rows,cardTitle,onEditClick,successMessage,errorMessage,showLoading,patientInfo} = this.props;
		
		
		return (
				<Paper elevation='0' >
				  { !showLoading && 
					  <MUIDataTable
					  title={cardTitle}
					  data={this.getPatientInfo()}
					  columns={this.getColumns()}
				      options={this.getOptions()}
					/> 
				  }
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