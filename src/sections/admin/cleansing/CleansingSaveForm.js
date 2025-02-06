import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import styled from 'styled-components';
import MUIDataTable from "mui-datatables";
import MUISaveButton from '../../../common/MUISaveButton'



import {
	  Alert,
	  AlertTitle,
	  Page,
	  Link,
	  Stack,
	  Checkbox,
	  TextField,
	  FilledInput,
	  Container,
	  ToggleButton,
	  ToggleButtonGroup,
	  Box,
	  Paper,
	  IconButton,
	  Typography,
	  LinearProgress,
	  InputAdornment,
	  FormControlLabel,
	  Autocomplete
	} from '@mui/material';
	
import {useAuth} from '../../../hooks/authContext.js';
import { LoadingButton } from '@mui/lab';



export default function CleansingSaveForm() {
	
	  const {loginContext, setLoginContext} = useAuth();
	  const navigate = useNavigate();
	  const [error, setError] = useState(null);
	  const [entityOptions, setEntityOptions] = useState([]);
	  const [fieldOptions, setFieldOptions] = useState([]);
	  const [fieldIds, setFieldIds] = useState([]);
	  const [fieldVals, setFieldVals] = useState([]);
	  const [selVal, setSelVal] = useState(null);
	  const [selFldId, setSelFldId] = useState('');
	  const [isLoading, setIsLoading] = useState(false);
	  const [data, setData] = useState(false);
	  const [repoData, setRepoData] = useState([]);


	  const fetchRepoInfo = async (topic,fieldName) => {
		  
		  setRepoData([]);
		  var url = loginContext.apiUrl+"/synonymRepo/get/"+topic+"/"+fieldName;
		  setIsLoading(true);	 
	   
		  const response = await axios.get(url, 
                                  {headers:{
                                    'Content-Type' :'application/json',
                                    'X-Requested-With':'XMLHttpRequest', 
                                    'UCSFAUTH-TOKEN':loginContext.token,
                                    'selRole':loginContext.selRole,
                                  }}
                                  ).catch((err) => {
             if(err && err.response)
                if(err.response.status != 200) 
                    setError("Unable to load studies");
          });
    	  
    	  if(response && response.data) {
              setData(response.data);
              setRepoData(getKeyData(response.data.keys,fieldName))
              setIsLoading(false);
           } else {
        	   setRepoData([]);
           }
	  }
	  
	  
    const saveRepoInfo = async () => {
		  
		  var url = loginContext.apiUrl+"/synonymRepo/save";
		  								  
		  setIsLoading(true);	 
	   
		  const response = await axios.post(url,JSON.stringify(data), 
                                  {headers:{
                                    'Content-Type' :'application/json',
                                    'X-Requested-With':'XMLHttpRequest', 
                                    'UCSFAUTH-TOKEN':loginContext.token,
                                    'selRole':loginContext.selRole,
                                  }}
                                  ).catch((err) => {
             if(err && err.response)
                if(err.response.status != 200) 
                    setError("Unable to load studies");
          });
    	  
    	  if(response && response.data) {
              fetchRepoInfo(selVal.id,selFldId.id);
              setIsLoading(false);
           } else {
        	   setRepoData([]);
           }
	  }
	  
	  
	  
	  

	  
	  useEffect(() => {
	      const fetchSchema = async () =>  {
		        
				 var url = loginContext.apiUrl+"/schema?phi=PHI_ACCESS&requestFor=INPUTUI";
				 const response = await axios.get(url, 
		                                  {headers:{
		                                    'Content-Type' :'applicaiton/json',
		                                    'X-Requested-With':'XMLHttpRequest', 
		                                    'UCSFAUTH-TOKEN':loginContext.token,
		                                    'selRole':loginContext.selRole,
		                                    'tagId':1
		                                  }}
		                                  ).catch((err) => {
		             if(err && err.response)
		                if(err.response.status != 200) 
		                	setError("Unable to load schema");
		          });
		    	  
		    	  if(response && response.data) {
		    		  extractData(response.data);
		           }
		     };
		  fetchSchema();
	      }, []);
	 
	 
	  const onEntitySelect = (event, values) => {
		  setSelVal(values);
		  setSelFldId('');
		  setRepoData([]);
	  };
	  
	  
	  const onFieldSelect = (event, values) => {
		  setSelFldId(values);
		  if(values) {
			  fetchRepoInfo(selVal.id,values.id);
		  }
	  };
	  
	  const updateKey =(val,tableMeta) => {
		  	console.log(val);
		  	console.log(tableMeta);
	  }
	  
	  const updateVal =(val,tableMeta) => {
		  	console.log(val);
		  	console.log(tableMeta);
		  	console.log(repoData[tableMeta.rowIndex]);
		  	repoData[tableMeta.rowIndex]['val']=val;
		  	setRepoData(repoData);
		  	console.log(repoData[tableMeta.rowIndex]);
		  	console.log(data);
	  }
	  
	  
	 
	  const getColumns = () => {
			var columns = [];
			var options = {};
			
			 columns.push({
		    	   name: 'key',
		    	   label: 'Key',
		    	   options: {
		    		   filter: false,
		    		   sort: false
		    		  }
		    	});
			 
			 
			 options = {};
			 
			 	options.customBodyRender = (value, tableMeta, updateValue) => {
					return (
							<TextField required defaultValue={value} color='primary' margin='normal'
								onChange={event => updateKey(event.target.value,tableMeta)}
		                      InputProps={{
		                          readOnly: false,
		                      }}
		                    />
			      );
				};
			columns[0].options = options;	
			 
			 
			 columns.push({
		    	   name: 'val',
		    	   label: 'Value',
		    	   options: {
		    		   filter: false,
		    		   sort: false
		    		  }
		    	});
			 
			 
			 options = {};
				
				options.customBodyRender = (value, tableMeta, updateValue) => {
					return (
							<TextField  color='primary' margin='normal' defaultValue={value} 
		                      onChange={event => updateVal(event.target.value,tableMeta)}
		                      InputProps={{
		                          readOnly: false,
		                      }}
		                    />
			      );
				};
			columns[1].options = options;	
			
			return columns;
	  }
	  
	  const options = {
			  download: false,
			  filter:false,
			  filterType:'multiselect',
			  print:false,
			  viewColumns:false,
			  search:false,
			  caseSensitive:false,
			  confirmFilters:false,
			  filterArrayFullMatch:false,
			  pagination:false,
			  fixedHeader:true,
			  responsive:'scroll',
			  selectableRows:'none',
			};
	  
	  const getKeyData = (keys,fieldName) => {
		  
		  if(selVal) {
			  var index = fieldOptions[selVal.id].findIndex(e => e.id == fieldName); 
			  var resData =keys;
			  
			  if(index != -1) {
				  var dataList = fieldVals[fieldIds[selVal.id][index]];
			
				  dataList.forEach(function(element,index) {
					  if(element &&  resData.findIndex(x => equalsIgnoreCaseAndTrim(x.key,element)) == -1 ) {
						  resData.push({"key":element,"val":""});
					  }
				  });
				  
				  return resData;
			  } else {
				  return [];
			  }
		  } else {
			  return [];
		  }
	  };
	 
	  const equalsIgnoreCaseAndTrim = (str1, str2)  => {
		  return str1.trim().toLowerCase() === str2.trim().toLowerCase();
	  };
	  
	  const extractData = (data) => {
    	  
  	   var entities =[];
  	   var entitiesOptions=[];
  	   var entitiesIcons=[];
  	   var  fieldsInfo=[];
  	    var fieldIds=[];
  	    var fieldVals=[];
  	 
  	   data.forEach(function(element,index) {
  	   
  		   if(element.type == 'enum') {
	  		  
  			   if(entities.indexOf(element.topic) == -1) {
	  			     entitiesOptions.push({ 'label': element.topic, 'id': element.className });
	  			     entities.push(element.topic);
	  	    		 entitiesIcons[element.className]=element.icon; 
	  	    		 fieldsInfo[element.className]=[]; 
	  	    		 fieldIds[element.className]=[]; 
	  	    		 fieldVals[element.className]=[]; 
	  	    		  
	  	    	 }
  	    		 fieldsInfo[element.className].push({ 'label':element.displayName, 'id': element.id });
  	    		 fieldIds[element.className].push(element.id);
  	    		 fieldVals[element.id]=element.values;
  	    	 }
  	    });
  	  
  	    setEntityOptions(entitiesOptions);
  	    setFieldOptions(fieldsInfo);
  	    setFieldIds(fieldIds);
  	    setFieldVals(fieldVals);
   	    
  	 };
	
	  return (
		<Paper>	  
		  <Stack spacing={3}  sx={{ 'paddingLeft':'100px','paddingTop':'50px','paddingBottom':'50px' }}  >
		    <Stack direction="row" alignItems="center" spacing={10.5}>     
		        <Autocomplete
		         disablePortal
		         id="topic-id"
		         options={entityOptions}
		         onChange={onEntitySelect}
		         defaultValue={'Demographics'}
		         value={selVal}
		         sx={{ width: 300 }}
		         renderInput={(params) => <TextField {...params} label="Topic" />} />
			   
		         <Autocomplete
			        disablePortal
			        id="field-id"
			        onChange={onFieldSelect}	
			        value={selFldId}	
			        options={selVal?fieldOptions[selVal.id]:[]}
			        sx={{ width: 300 }}
			        renderInput={(params) => <TextField {...params} label="Field Name" />} />
			 
			    <LoadingButton
		            variant="contained"
		            disabled={!true }
		            loading={isLoading} onClick={saveRepoInfo}>
		            Save
		        </LoadingButton>
		            
		    </Stack> 
			 
			 <MUIDataTable
			  title={(selVal && selFldId )? selVal.label+" : "+selFldId.label:''}
			  data={repoData}
			  columns={getColumns()}
			  options={options}
			/>
		 </Stack>
	   </Paper>	 
	  );
}
	