import { useState,useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import TagChooser from './TagChooser.js'
import MUIDataTable from "mui-datatables";

import {
	  Stack,
	  Paper,Button,
      Typography,
      LinearProgress
	} from '@mui/material';
	
	
	
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';


import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import Select, { SelectChangeEvent } from '@mui/material/Select';

import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import {useAuth} from '../../../hooks/authContext.js';
import axios from "axios";




export default function CleansingSaveForm({selSet,tagInfo,markEdited}) {
	
	  const [tagMode, setTagMode] = useState(false);   
	  const [tagFlag, setTagFlag] = useState(null);   
	  const [selectedData, setSelectedData] = useState(null);  
	  
	  const [selTags, setSelTags] = useState('');
	  const [isLoading, setIsLoading] = useState(false);
	  const {loginContext, setLoginContext} = useAuth();
	  const [refresh, setRefresh] = useState(false);


	
	  const navigate = useNavigate();
	  
	  useEffect(() => {
	      const fetchSchema = async () =>  {
		        
				
		     };
		  fetchSchema();
	      }, [refresh]);
		  
		  const getOptions =() =>{
		  		var options = {};
		  	
			  	options.fixedHeader = true;
			  	options.print =false;
			  	options.pagination = false;
			  	options.responsive='scroll';
			  	options.selectableRows = 'multiple';
			  	//options.filterType='multiselect';
			    options.download=false;
			
				
				options.onRowsSelect=(changedRows, allRowsSelected, rowsSelected, dataIndex) => {
				   setSelectedData(rowsSelected.map(index => selSet.elems[index]));
				 };
				
				
				options.customToolbarSelect=(selectedData, { setSelectedRows }) => {
				      return (
						
						(tagMode ===false) ? (<Stack direction="row" spacing={2}>
							
						<Button variant="outlined" onClick={handleTagClick} startIcon={<BookmarkAddIcon fontSize='large'  />}>
						     Tag
						</Button>
						
						<Button variant="outlined" onClick={handleUnTagClick} startIcon={<BookmarkRemoveIcon fontSize='large'  />}>
							UnTag
					 	</Button> 
							
						   </Stack>) :	(<Stack direction="row" spacing={2}>
							              
							
							<Box sx={{ minWidth: 320 }}>
							<Stack direction="row" spacing={2}>
							<Typography variant="h6"  sx={{paddingTop:'18px'}}> {tagFlag} </Typography>
							<FormControl fullWidth>
							       <InputLabel id="demo-simple-select-label">Studies</InputLabel>
							       <Select
							         labelId="demo-simple-select-label"
							         id="demo-simple-select"
							         value={selTags}
							         label="Studies"
							         onChange={handleTagSel}
							       >
						   {tagInfo.map((tag) => (
					            <MenuItem key='{tag.tagName}' value={tag.tagName}>
					              {tag.tagName}
					            </MenuItem>
					          ))}
							       </Select>
							     </FormControl>
						         </Stack>		 
							</Box> 
											  
		  					 <IconButton  onClick={handleSaveClick} color="sucess">
		  					      <SaveIcon color="primary"  fontSize='medium'/>
		  				 	 </IconButton>	
							 <IconButton  onClick={handleCancelClick} color="sucess">
			  					      <CancelIcon color="primary"  fontSize='medium' />
			  				 	 </IconButton>	
						</Stack>)
				      );
				    }
		    
		        return options;
		    };
			
			const handleTagSel = (event: SelectChangeEvent) => {
				    setSelTags(event.target.value);
			};
			
			
			const handleSaveClick= async() => {
				
				   setIsLoading(true);
				   let response =null;
				   
				   
				   selectedData && selectedData.forEach(obj=>{
					
				
					let mrn= obj.name;
					let tags = obj.sets;
					
					if(tagFlag =='Tag') {
						
						if(obj.sets.includes(selTags) == false) {
							tags.push(selTags);	
							response =  postTagInfo(mrn,tags);				
						}
						
						
					} else if(tagFlag =='UnTag'){
						
						if(obj.sets.includes(selTags) == true) {
							tags.splice(tags.indexOf(selTags), 1);
							response =  postTagInfo(mrn,tags);			
						}
						
					}
				   });
				   
				   if(response != null) {
						setTagFlag(null);
						setTagMode(false); 
						setIsLoading(false);
						setRefresh(!refresh);
						markEdited();
				   }
								 	
			 };
			 
			 
			 
			 const postTagInfo = async (mrn,tags) => {
			  	  
			  	  var url = loginContext.apiUrl+"/studyTag/"+mrn+"/studytags";
			 	  
			 	    setIsLoading(true);	
			 	  
			  		const response = await axios.post(url,JSON.stringify(tags), 
			                                  {headers:{
			                                    'Content-Type' :'application/json',
			                                    'X-Requested-With':'XMLHttpRequest', 
			                                    'UCSFAUTH-TOKEN':loginContext.token,
			                                    'selRole':loginContext.selRole,
			                                  }}
			                                  ).catch((err) => {
			             if(err && err.response)
			                if(err.response.status != 200)  {
								
							}
			                    
			          });
					  
					return response;  
			   }
			 
					 
			 const handleCancelClick= () => {
				     setTagFlag(null);
					 setTagMode(false);
					

			 	};

			const handleTagClick = () => {
			        setTagFlag('Tag');
					setTagMode(true);
					
		    };
				
			const handleUnTagClick = () => {
				setTagFlag('UnTag');
				setTagMode(true);
				
			}	
			
			const getColumns = () => {
				var columns = [];
				var options = {};
				
				columns.push({
				    	   name: ' ',
				    	   label: ' ',
				    	   options: {
				    		   filter: true,
				    		   sort: true
				    		  }
				    	});
				
				columns.push({
				    	   name: 'name',
				    	   label: 'MRN',
				    	   options: {
				    		   filter: true,
				    		   sort: true
				    		  }
				    	});
					 

				 options.filter=false;
				 options.viewColumns=false;
				 columns[1].options = options;
				 
				 
				 columns.push({
 				    	   name: 'sets',
 				    	   label: 'Studies',
 				    	   options: {
 				    		   filter: true,
 				    		   sort: true
 				    		  }
 				    	});
						
						
						options = {};
							
							options.customBodyRender = (value, tableMeta, updateValue) => {
								
								return <TagChooser mrn={tableMeta.rowData[1]} value={value} tagInfo={tagInfo} markEdited={markEdited} />							
															
							};
					columns[2].options = options;			
			
				 return columns;
			}
	 
	 
	  return (
		<Paper>
		{ isLoading === true && 
				   			   
			<Box sx={{ width: '100%' }}>
			     <LinearProgress />
			   </Box>
		}
						  
		<MUIDataTable
            title={"Patients  "+selSet.name}
            options={getOptions()}
            data={selSet.elems}
            columns={getColumns()} 
            />
	   </Paper>	 
	  );
}
	