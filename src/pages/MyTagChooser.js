import * as React from 'react';



import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useAuth} from '../hooks/authContext.js';
import axios from "axios";





export default function MyTagChooser({value,mrn}) {
  	
	const [tagMode, setTagMode] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const [selTags, setSelTags] = React.useState(value);
	const [initialTags, setInitialTags] = React.useState(value);
	const {loginContext, setLoginContext} = useAuth();
	const [error, setError] = React.useState(null);


	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	
	const MenuProps = {
	  PaperProps: {
	    style: {
	      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
	      width: 250,
	    },
	  },
	};


		
	 const handleAddTagClick= () => {
			setTagMode(true);
	 };
	 
	 const handleSaveClick= () => {
		     saveTagInfo();
	 };
	 
	 
	 
	 const saveTagInfo = async () => {
	 	  
	 	  var url = loginContext.apiUrl+"/studyTag/"+mrn+"/studytags";
		  
		    setIsLoading(true);	
		  
	 		const response = await axios.post(url,JSON.stringify(selTags), 
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
	             setIsLoading(false);
				 setTagMode(false);
				 setInitialTags(selTags);
				 
	          } else {
				setIsLoading(false);
				setTagMode(false);
	       	  }
			 
		}
			 
	    const handleCancelClick= () => {
	 			setTagMode(false);
				setSelTags(initialTags);
	 	};
	
	  
		
		const handleChange = (event: SelectChangeEvent<typeof selTags>) => {
		    const {
		      target: { value },
		    } = event;
		    setSelTags(
		      // On autofill we get a stringified value.
		      typeof value === 'string' ? value.split(',') : value,
		    );
		  };


  return (
	
			<Stack direction="row" spacing={1}>
				 {tagMode == false &&
			     <Stack direction="row" spacing={1}>
					 {selTags.map((object, i) => 	<Chip
								        label={object}
								        variant="outlined"
								      />)}
															
					
				  </Stack>	
				  }
				 
			</Stack>
												
    
  );
}
