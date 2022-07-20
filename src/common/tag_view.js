import React from 'react';
import Button from '@material-ui/core/Button';
import TagDetailView  from './tag_detail_view';
import { makeStyles } from '@material-ui/core/styles';

class TagView extends React.Component {
 
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	open:false,
	    	lLabel:'',
	    	studyTag:[],
	    	showLoading:false,
	    };
	 }
	
	async extractData (lLabel) {
	    const {config} = this.props;
	    this.setState({showLoading:true});
	    var studyTag = null //await Actions.fetchStudyTagByName({config,lLabel});
	    this.setState({studyTag:studyTag,showLoading:false});
	};	

	render() {
	    const { value,classes,displayName,config} = this.props;
	     const handleClickOpen = (open,lLabel) => {
	    	
	      if(open === true){
	    	this.extractData(lLabel); 
	      }
	     
	      this.setState({open:open});
	      this.setState({lLabel:lLabel});
	    
	    };
	    const handleClose = () => {
	      this.setState({open:false});
	    };
	   
	    return (
	    		<div>
	    		 {value.split(";").map((val, index) => (
				            <Button  style={{margin:3}} variant="outlined" onClick={() =>handleClickOpen(true,val)} color="primary" >
				               {val}
				            </Button>
				        ))}
				 <TagDetailView  config={config} studyTag={this.state.studyTag} showLoading={this.state.showLoading} handleClose={handleClose} open={this.state.open} lLabel={this.state.lLabel} />
				</div>
	    );
	  }
}


export default TagView;