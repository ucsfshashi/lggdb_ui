import { useState,useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import TagChooser from './TagChooser.js'

import MUIDataTable from "mui-datatables";

import {
	  Stack,
	  Paper,Button
	} from '@mui/material';
	
	
	
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';


	



export default function CleansingSaveForm({selSet,tagInfo}) {
	
	const [tagMode, setTagMode] = useState(false);   
	
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
						
						<Stack direction="row" spacing={2}>
						
						
						<Button variant="outlined" startIcon={<BookmarkAddIcon fontSize='large'  />}>
						     Tag
						</Button>
						
						<Button variant="outlined" startIcon={<BookmarkRemoveIcon fontSize='large'  />}>
							UnTag
						</Button>
											
				         
						  
						  </Stack>
				      );
				    }
		    
		        return options;
		    };
			
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
								
								return <TagChooser value={value} tagInfo={tagInfo} />							
															
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
	