import * as React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';



export default function SetChooser({tagInfo,handleCheck,checkedItems}) {
  
	
	const [checked, setChecked] = React.useState(checkedItems);

  const handleToggle = (value: string) => () => {
	    const currentIndex = checked.indexOf(value);
	    const newChecked = [...checked];

	    if (currentIndex === -1) {
	      newChecked.push(value);
	    } else {
	      newChecked.splice(currentIndex, 1);
	    }
	
		setChecked(newChecked);
		handleCheck(newChecked);
  };

  return (
    <List
	  sx={{
	       width: '100%',
	       maxWidth: 360,
	       bgcolor: 'background.paper',
	       position: 'relative',
	       overflow: 'auto',
	       maxHeight: 650,
	       '& ul': { padding: 0 },
	     }}
      
	  
	  subheader={<ListSubheader>Studies</ListSubheader>}
    >
      {
		tagInfo &&  tagInfo.map((element) =>  element && 
	
		
		       <ListItem alignItems="flex-start">
		       
				
		       <ListItemText
			   
			      primaryTypographyProps={{ fontSize: 16, fontWeight: 'medium' }}
		          primary={element.tagName}
				  secondarTypographyProps={{ fontSize: 16, fontWeight: 'large' }}
		          secondary={
		            <React.Fragment>
		              <Typography
		                component="span"
		                variant="body2"
		                sx={{ color: 'text.sucess', display: 'inline' }}
		              >
		               {element.noOfPatients}
		              </Typography>
		             
		            </React.Fragment>
		          }
		        />
				
			      <Switch
			         edge="end"
			         onChange={handleToggle(element.tagName)}
			         checked={checked.includes(element.tagName)}
			         inputProps={{
			           'aria-labelledby': 'switch-list-label-wifi',
			         }}
					       />
		      </ListItem>
		     
	
		)
	  }
    </List>
  );
}
