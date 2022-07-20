import React from 'react';
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';

class LinkView extends React.Component {
 
	constructor(props) {
	    super(props);
	}
	render() {
	    const {value,classes} = this.props;
	   
	    const openInNewTab = (url) => {
	    	  const newWindow = window.open(url.value, '_blank', 'noopener,noreferrer')
	    	  if (newWindow) newWindow.opener = null
	    	}
	    
	    return (
				<div>
				{ value &&
				  <div>	
					  <Link href="#" onClick={() => openInNewTab({value})} >
				  		<Typography noWrap variant="h6" >
				  			{value}
				  		</Typography> 
				      </Link>
				  </div> }
			     { !value && 
			    	 <div> {"----"} </div>
			     }
			  </div>
	    );
	  }
 }
export default LinkView;