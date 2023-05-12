import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import configData from "../../../config.json";

import React from 'react';


// material
import {
  ListSubheader,
  Alert,
  List,
  Stack,
  Button,
  Paper,
  Box,
  IconButton,
  Typography,
  LinearProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import Page from '../../../components/Page';

import { LoadingButton } from '@mui/lab';
// component
import {useAuth} from '../../../hooks/authContext.js';
import ResetTvIcon from '@mui/icons-material/ResetTv';
import {EntityDiv,FieldDiv,FieldDetailsDiv} from '../../../common/entity_fld_components';
import Iconify from '../../../components/Iconify';
import SaveIcon from '@mui/icons-material/Save';




// ----------------------------------------------------------------------
// -- export default function DefineDataTypes({selTagInfo,goBackList}) {

export default class AttentionView extends React.Component {
      
   async fetchData () {
        var url = this.props.loginContext.apiUrl+"/studyTag/"+this.props.selTagInfo.tagId+"/dataTypes/globalSchema";
    	 
    	
    	 
    	  const response = await axios.get(url, 
                                  {headers:{
                                    'Content-Type' :'applicaiton/json',
                                    'X-Requested-With':'XMLHttpRequest', 
                                    'UCSFAUTH-TOKEN':this.props.loginContext.token,
                                    'selRole':this.props.loginContext.selRole,
                                  }}
                                  ).catch((err) => {
             if(err && err.response)
                if(err.response.status != 200) 
                    this.setState({error:"Unable to load studies"});
          });
    	  
    	  if(response && response.data) {
    		  this.setState({dataTypesWithGlobalSchema:response.data})
    		  this.extractData(response.data);
              this.setState({loading:false})
           }
   };
   componentDidMount(){
		this.fetchData();
   };   
      
  
  
   extractData (data) {
  
	   var entities =[];
	   var entitiesIcons=[];
	   var fieldsInfo=[];
	 
	   data.dataTypes.forEach(function(element,index) {
	    	 if(entities.indexOf(element.topic) == -1) {
	    		 entities.push(element.topic);
	    		 entitiesIcons[element.topic]=element.icon; 
	    		 fieldsInfo[element.topic]=[]; 
	    	 }
	    	 fieldsInfo[element.topic].push(element);
	    });
	   
	   //Sort Entities
	   entities.sort();
	
	   this.setState({entities:entities,
	   				  entitiesIcons:entitiesIcons,
	   				  fieldsInfo:fieldsInfo,
	   				  activeGroup:'Demographics',
	   				  activeField:fieldsInfo['Demographics'][0].displayName,
	   				  activeFieldElement:fieldsInfo['Demographics'][0]});
	   
   };
  
  state = {
  	  error:null,
	  loginContext:this.props.loginContext,
	  loading: true,
	  saveLoading:false,
	  dataTypesWithGlobalSchema:[],
	  entities:[],
	  entitiesIcons:[],
	  fieldsInfo:[],
	  activeGroup:null,
	  activeField:null,
	  activeFieldElement:null
	};
  
  render() {
  
  const {selTagInfo,goBackList} = this.props;
 
   const handleEntityClick = (evt,element) => {
	   
	   if(this.state.fieldsInfo) {
	       var fieldsInfo = this.state.fieldsInfo; 
		   this.setState({activeGroup:element});
		   this.setState({activeFieldElement:fieldsInfo[element][0]});
      	   this.setState({activeField:fieldsInfo[element][0].displayName});
		   
	   }
   };
   
   const handleCheckBoxChange = (evt,element) => {
   		element.enabled=!element.enabled;
   	  
   	  	this.setState({activeFieldElement:element});
      	this.setState({activeField:element.displayName});
      	
   };

   const handleFieldClick = (evt,element) => {
      	this.setState({activeFieldElement:element});
      	this.setState({activeField:element.displayName});
   };
   
   const handleEditable= (evt) => {
   
        var activeFieldElement = this.state.activeFieldElement;
        
        if(evt.target.value == 'Y') {
        	activeFieldElement.editable= true;
        } else {
       	    activeFieldElement.editable= false;
        }
        this.setState({activeFieldElement:activeFieldElement});
   };
   
   
   const handleDisplayNameChange = (e) => {
        var activeFieldElement = this.state.activeFieldElement;
  		activeFieldElement.displayName=e.target.value;
		this.setState({activeFieldElement:activeFieldElement});
	}

   const handleNonPHIDisplayNameChange = (e) => {
        var activeFieldElement = this.state.activeFieldElement;
		activeFieldElement.nonPHIDisplayName=e.target.value;
		this.setState({activeFieldElement:activeFieldElement});
	}
	
	const fiedCount = (topicName) => {
	  return this.state.fieldsInfo[topicName].filter(ele => ele.enabled== true).length;
	}

	const saveDataTypes = async (e) => {
		 this.setState({saveLoading:true});
		
		 var url = this.props.loginContext.apiUrl+"/studyTag/"+this.props.selTagInfo.tagId+"/dataTypes";
    	
    	const headers = { 
   		   'Content-Type' :'application/json',
           'X-Requested-With':'XMLHttpRequest',
           'UCSFAUTH-TOKEN':this.props.loginContext.token
   	 		 };
	  
	      //Preparing final list
	      var finalList =[];
			this.state.dataTypesWithGlobalSchema.dataTypes.forEach(function(element,index) {
			    	if(element.enabled === true) {
			    		finalList.push(element);
			    	}
	    	});	 
	
	      //Saving data type changes
		  var rInfo=await axios.post(url, 
				  JSON.stringify(finalList), { headers }).catch((err) => {
						if(err && err.response)
							if(err.response.status != 200) 
							this.setState({error:"Error while saving data types"});
							});    
		  
		  
		    if(rInfo && rInfo.status == 200) {
		 	 this.setState({successMsg:'Define datatypes is successfully '});	
	 		}
		  
		  
		  this.setState({saveLoading:false});	
	}	

    const entityList =  ()  =>  {
		return (
				<List
			      sx={{
			        width: '100%',
			        maxWidth: 600,
			        overflow: 'auto',
			        height: 900,
			        '& ul': { padding: 0 },
			      }}
			    >
				 <ListSubheader>
				 	<Typography variant="h4" component="h3">
		         		Topics
		         		</Typography>
				 </ListSubheader>
				 {  this.state.entities.map((element) =>  element && 
					<EntityDiv  fiedCount={fiedCount} handleEntityClick={handleEntityClick} 
								isActive={this.state.activeGroup==element} 
								icon={this.state.entitiesIcons[element]} label={element} />)}
			    </List>
		  );
	};
	
	const  fieldList =  ()  =>  {
	
		return (
		
				<List
			      sx={{
			        width: '550px',
			        maxWidth: 600,
			        overflow: 'auto',
			        height: 900,
			        '& ul': { padding: 0 },
			      }}
			    >
				 <ListSubheader>
				 	<Typography variant="h4" component="h3">
		         		<Iconify icon={this.state.entitiesIcons[this.state.activeGroup]}/> {this.state.activeGroup}
		         	</Typography>
				 </ListSubheader>
				 { this.state.fieldsInfo && this.state.activeFieldElement &&  this.state.fieldsInfo[this.state.activeGroup] && this.state.fieldsInfo[this.state.activeGroup].map((element) =>  element && 
		  			<FieldDiv  isRequired={element.require==true} isActive={this.state.activeFieldElement.displayName==element.displayName}  
		  	  				   handleCheckBoxChange={(e) => handleCheckBoxChange(e,element)}  
		  	  				   enabled = {element.enabled}
		  	                   onClick={(e) => handleFieldClick(e,element)} 
		  	                   fieldDisplayName={element.displayName}  fieldId={element.className+'.'+element.id} />	)}
			    </List>
		 );
	};
	
	
  return (
		  <Page title="Studies">
	       <Stack > 
		  	<Box sx={{ pb: 5 }}>
	        <Stack direction="row" alignItems="center" spacing={0.5}>    
	          <Typography variant="h4">Studies : {selTagInfo.tagName} </Typography>
	          <IconButton aria-label="restart" size="medium"  onClick={() => goBackList()}>
	            <ResetTvIcon color="success" fontSize="inherit" />
	          </IconButton>    
	        </Stack>
	        </Box>
	        <Stack sx={{
			        width: '90%',
			      }}>
	        	<AppBar position="static" color='transparent' variant="dense" >
	        		<Toolbar variant="dense">
	        			<Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            				 <Iconify icon={'eva:layers-fill'} width={22} height={22} /> Define data types
          				</Typography>
	        		 	{this.state.successMsg &&
      						<Alert severity="success">
		        				{this.state.successMsg}
		        			</Alert>
		        		}
	        		   <LoadingButton  sx={{ marginBottom:'5px' }} loading={this.state.saveLoading} loadingPosition="start" variant="contained"  onClick={(e)=>saveDataTypes(e)} size='large' startIcon={<SaveIcon />}>
    					Save
  					  </LoadingButton>
      				</Toolbar>
	        	</AppBar>
	        	
	        	{this.state.loading && <LinearProgress /> }
        		<Stack direction="row" alignItems="center" spacing={1}>  
        		<Paper elevation={4}  sx={{paddingLeft:3,
			        paddingRight:3,width: '100%' }} > {entityList()} </Paper>
        		<Paper elevation={4} sx={{paddingLeft:3,
			        paddingRight:3 }} > {fieldList()} </Paper>
        		<Paper elevation={4} sx={{
			        width: '100%',
			        maxWidth: 600,
			        overflow: 'auto',
			        height: 900,
			        paddingLeft:3,
			        paddingRight:3,
			        '& ul': { padding: 0 },
			      }} > {this.state.activeFieldElement && 
						<FieldDetailsDiv activeFieldElement={this.state.activeFieldElement} 
						handleDisplayNameChange={(e) => handleDisplayNameChange(e)} 
						handleNonPHIDisplayNameChange={(e) => handleNonPHIDisplayNameChange(e)} 
						handleEditable={(e) => handleEditable(e)} 
   						/>} </Paper>
        		</Stack>
	        </Stack>
	        </Stack>
    	   </Page>
  );
  }
}
