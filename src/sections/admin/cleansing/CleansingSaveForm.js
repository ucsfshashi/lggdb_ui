import { useState,useEffect } from 'react';
import {useNavigate } from 'react-router-dom';

import TagChooser from './TagChooser.js'

import MUIDataTable from "mui-datatables";

import {
	  Stack,
	  Paper,Button
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


export default function CleansingSaveForm({selSet,tagInfo}) {
	
	  const [tagMode, setTagMode] = useState(false);   
	  const [tagFlag, setTagFlag] = useState(null);   
	  const [selTags, setSelTags] = useState('');

	
	  const navigate = useNavigate();
	  
	  useEffect(() => {
	      const fetchSchema = async () =>  {
		        
				
		     };
		  fetchSchema();
	      }, []);
		  
		  const getOptions =() =>{
		  		var options = {};
		  	
			  	options.fixedHeader = true;
			  	options.print =false;
			  	options.pagination = false;
			  	options.responsive='scroll';
			  	options.selectableRows = 'multiple';
			  	//options.filterType='multiselect';
			    options.download=false;
				
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
							              
							
							<Box sx={{ minWidth: 120 }}>
							<FormControl fullWidth>
							       <InputLabel id="demo-simple-select-label">Studies</InputLabel>
							       <Select
							         labelId="demo-simple-select-label"
							         id="demo-simple-select"
							         value={selTags}
							         label="Studies"
							         onChange={handleChange}
							       >
						   {tagInfo.map((tag) => (
					            <MenuItem key='{tag.tagName}' value={tag.tagName}>
					              {tag.tagName}
					            </MenuItem>
					          ))}
							       </Select>
							     </FormControl>
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
			
			const handleChange = (event: SelectChangeEvent) => {
				    setSelTags(event.target.innerText);
			};
			
			
			const handleSaveClick= () => {
				   setTagFlag(null);
				   setTagMode(false);
								 	
			 };
					 
			 const handleCancelClick= () => {
				     setTagFlag(null);
					 setTagMode(false);
			 	};

			const handleTagClick = () => {
			        setTagFlag('tag');
					setTagMode(true);
		    };
				
			const handleUnTagClick = () => {
				setTagFlag('unTag');
				setTagMode(false);
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
								
								return <TagChooser mrn={tableMeta.rowData[1]} value={value} tagInfo={tagInfo} />							
															
							};
					columns[2].options = options;			
			
				 return columns;
			}
	 
	 
	  return (
		<Paper>	  
		<MUIDataTable
            title={"Patients  "+selSet.name}
            options={getOptions()}
            data={selSet.elems}
            columns={getColumns()} 
            />
	   </Paper>	 
	  );
}
	