import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
//import {fetchFileJson} from '../../../helpers/fetch_helper';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';


const styles = theme => ({
	title: {
		  height:40,
		  minHeight:40, 
	},
	  content:{
		  backGroundColor:'black',
	  },
	  footer: {
		  height:40,
	  },
	  title: {
		    flexGrow: 1,
	  },
	  stepper: {
		  height:40,
		  minHeight:40,
	  } 
});


class FileView extends React.Component {
 
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	open:false,
	    	files:[],
	    	fileNames:[],
	    	activeStep:0,
	    };
	 }
	
	 handleNext = () => {
		 var prevActiveStep =this.state.activeStep;
		 this.setState({ activeStep:(prevActiveStep+1)});
	  };

	 handleBack = () => {
		 var prevActiveStep =this.state.activeStep;
		 this.setState({ activeStep:(prevActiveStep-1)});
	  };
	  
	  async onSave(files) {
	    const {config} = this.props;
	    
	    const formData = new FormData()
	    for(var x = 0; x<files.length; x++) {
	    	formData.append('file', files[x])
	    }

	    const uploadInfo = null; /* await fetchFileJson(`${config.apiUrl}/uploadInfo`, {
	      method: 'POST',
	      body: formData
	    });*/
	    
	    this.props.handleChange(uploadInfo.fileDownloadUri);
	 };

	 async setOpen(selectedOption) {
		 const {config,value} = this.props;
		 const uploadInfo = null; /* await fetchFileJson(`${config.apiUrl}/uploadInfo/${value}`, {
		      method: 'GET'
		    }); */

		 var files = [];
		 var fileNames = [];
		 
		 if(selectedOption === true) {
			 if(uploadInfo) {
				 if(uploadInfo.childDownloadUris 
					&& uploadInfo.childDownloadUris.length >0) {
					 
					 for(var index in uploadInfo.childDownloadUris) {
						 fileNames.push(+uploadInfo.childDownloadUris[index].fileName);
						 files.push(config.apiUrl+'/file/'+uploadInfo.childDownloadUris[index].fileDownloadUri);
					 }
				 } else {
					 fileNames.push(uploadInfo.fileName);
					 files.push(config.apiUrl+'/file/'+uploadInfo.fileDownloadUri);
				 }
			 }
			 this.setState({ open:selectedOption,files:files,fileNames:fileNames }); 
		 } else {
			 this.setState({ open:selectedOption});
		 }
	} 
	
 	 render() {
	    const { open,activeStep,files,fileNames } = this.state;
	    const { value,classes,displayName } = this.props;
		return (
				<div>
				  
				{ value &&
				
				<div>	
				<Button
			        variant="text"
			        size="medium"		
			        color="link"
			        startIcon={<AddPhotoAlternateOutlinedIcon />} onClick={() => this.setOpen(true)} >
			        	{"View Files"} 
			       </Button>
			      
			      <Dialog open={open} scroll='paper' aria-labelledby="customized-dialog-title" >
			        <DialogTitle  className={classes.title} id="customized-dialog-title" onClose={() => this.setOpen(false)}>
				        <Toolbar>
				          <Typography variant="h5" className={classes.title}>
				          		{displayName}
				          </Typography>
				          <Button color="inherit" 
				        	  startIcon={<CloseIcon />} onClick={() => this.setOpen(false)}>Close</Button>
				        </Toolbar>
				    </DialogTitle>
			        <DialogContent  className={classes.content}  >
				        <img
				        	src={files[activeStep]}
				        	alt={fileNames[activeStep]}
				        />
			        </DialogContent>
			        <DialogActions className={classes.footer}>

			        <MobileStepper
			        	className={classes.stepper}
				        steps={files.length}
				        position="static"
				        variant="dots"
				        activeStep={activeStep}
				        nextButton={
				          <Button size="small" onClick={() => this.handleNext()} disabled={activeStep === files.length - 1}>
				            	Next
					          	<KeyboardArrowRight />
				          </Button>
				        }
				        backButton={
				          <Button size="small" onClick={() => this.handleBack()} disabled={activeStep === 0}>
				          	<KeyboardArrowLeft />
				            	Back
				          </Button>
				        }
			        />
			        
			        </DialogActions>
			      </Dialog>
			     </div> }
			     { !value && 
			    	 <div> {"----"} </div>
			     }
			      	
			  </div>
	    );
	  }
}


export default withStyles(styles)(FileView);