import * as React from 'react';



import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';


export default function TagChooser({tagInfo,value}) {
  
	
	const [tagMode, setTagMode] = React.useState(false);
	const [selTags, setSelTags] = React.useState(value);
	const [initialTags, setInitialTags] = React.useState(value);

	
	

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


	const handleTagClick = () => {
	      console.info('You clicked the Chip.');
	    };
		
	 const handleAddTagClick= () => {
		setTagMode(true);
	 };
	 
	 const handleSaveClick= () => {
	 			setTagMode(false);
	 		 };
			 
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
															
					 <IconButton  onClick={handleAddTagClick} color="primary" aria-label="add an alarm">
					          <BookmarkAddIcon color="primary" fontSize='medium' />
				 	 </IconButton>	
				  </Stack>	
				  }
				  {tagMode == true &&
					  <Stack direction="row" spacing={0}>
				  
					  <Select sx={{ m: 1, width: 300 }}
					          id="demo-multiple-checkbox"
					          multiple
					          value={selTags}
					          onChange={handleChange}
					          input={<OutlinedInput label="Studies" />}
					          renderValue={(selected) => selected.join(', ')}
					          MenuProps={MenuProps}
					        >
					          {tagInfo.map((tag) => (
					            <MenuItem key={tag.tagName} value={tag.tagName}>
					              <Checkbox checked={selTags.includes(tag.tagName)} />
					              <ListItemText primary={tag.tagName} />
					            </MenuItem>
					          ))}
					     </Select>
					  
	  					 <IconButton  onClick={handleSaveClick} color="sucess">
	  					      <SaveIcon color="primary"  fontSize='medium'/>
	  				 	 </IconButton>	
						 <IconButton  onClick={handleCancelClick} color="sucess">
 	  					      <CancelIcon color="primary"  fontSize='medium' />
 	  				 	 </IconButton>	
					  
					  </Stack>
			  	  }
			</Stack>
												
    
  );
}
