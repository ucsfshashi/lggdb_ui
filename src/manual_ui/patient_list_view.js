import React from 'react';
import {createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import MUIDataTable from "mui-datatables";
import MUIAddButton from '../common/MUIAddButton'
import ChildMenu from './child_menu'
import {Paper,Button,Grid,Typography,Divider,LinearProgress,Stack} from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';



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
					  			 goBackToList={this.props.goBackToList}	
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
	
	getTitle = (cardTitle) => {
		
		if(cardTitle instanceof Array) {
	  		return (<Breadcrumbs aria-label="breadcrumb">
	  	  	<Link variant="h5" underline="hover" color="inherit"  href="#" onClick={(event,topic)=>this.props.goBackToList(null,cardTitle[0].topic)}>
	  	        {cardTitle[0].topic}{'('+cardTitle[0].value+')'}
	  	     </Link>
	  	   <Typography variant="h5" color="text.primary">{cardTitle[1].topic}</Typography>
	   	    </Breadcrumbs> );	 	
	  	}
		else
		{
	  	 return (<Typography variant="h5" color="text.primary">{cardTitle}</Typography>);
	  	}
	}

	render() {  
	
		const { rows,cardTitle,onEditClick,successMessage,errorMessage,showLoading,patientInfo} = this.props;
		
		
		return (
				<Stack >    
				 <MUIDataTable
				  title={this.getTitle(cardTitle)}
				  data={this.getPatientInfo()}
				  columns={this.getColumns()}
			      options={this.getOptions()}
				 /> 
		        {showLoading  && <LinearProgress />}
		        </Stack>
		  );
	}
}