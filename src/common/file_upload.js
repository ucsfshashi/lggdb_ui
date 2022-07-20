import { DropzoneDialog } from 'material-ui-dropzone';
import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';


export default class FileUpload extends React.Component {
 
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	open:false,
	    	files:[],
	    };
	 }
 	
	 async onSave(files) {
	    const {config,value} = this.props;
	    
	    const formData = new FormData()
	    for(var x = 0; x<files.length; x++) {
	    	formData.append('file', files[x])
	    }
	    
	    if(value) { // update
		    const uploadInfo = null;  /*await fetchFileJson(`${config.apiUrl}/uploadInfo`, {
		      method: 'POST',
		      body: formData
		    }); */
		   
		    if(uploadInfo && uploadInfo.fileDownloadUri) {
		    	this.props.handleChange(uploadInfo.fileDownloadUri);
		    	this.setState({ open:false});
		    }
	    } else {   // insert 
	   
	    	const uploadInfo = null;  /* await fetchFileJson(`${config.apiUrl}/uploadInfo/${value}`, {
		      method: 'POST',
		      body: formData
		    }); */
		   
	    	if(uploadInfo && uploadInfo.fileDownloadUri) {
		    	this.props.handleChange(uploadInfo.fileDownloadUri);
		    	this.setState({ open:false});
		    }
	    }
	 };

	 async setOpen(selectedOption) {
		 const {config,value} = this.props;
		 
		 
		 if(selectedOption === true && value) {
			
			 const uploadInfo =null;  /*await fetchFileJson(`${config.apiUrl}/uploadInfo/${value}`, {
			      method: 'GET'
			    }); */
	
			 var files = [];
		 
		
			 if(uploadInfo) {
				 if(uploadInfo.childDownloadUris 
					&& uploadInfo.childDownloadUris.length >0) {
					 
					 for(var index in uploadInfo.childDownloadUris) {
						 files.push(config.apiUrl+'/file/'+uploadInfo.childDownloadUris[index].fileDownloadUri);
					 }
				 } else {
					 files.push(config.apiUrl+'/file/'+uploadInfo.fileDownloadUri);
				 }
			 }
			 this.setState({ open:selectedOption,files:files }); 
		 } else {
			 this.setState({ open:selectedOption});
		 }
	} 
	
 	 render() {
	    const { open } = this.state;
	    const { value,field } = this.props;
		return (
				<div>
				  <Button
			        variant="text"
			        size="medium"		
			        color="link"
			        startIcon={<AddPhotoAlternateOutlinedIcon />} onClick={() => this.setOpen(true)} >
			        	{value?"View/Change Files":"Add Files"} 
			      </Button>
			      
			      <DropzoneDialog
			      	dialogTitle={field.displayName}
			      	acceptedFiles={['image/*']}
			      	cancelButtonText={"cancel"}
			      	submitButtonText={"submit"}
			      	maxFileSize={5000000}
			      	open={open}
			      	filesLimit={5}
			        initialFiles={this.state.files}
			      	showPreviews={false} 
			      	showPreviewsInDropzone={true}
			      	onClose={() => this.setOpen(false)}
			      	onSave={(files) => this.onSave(files)}
			      	previewGridProps ={ <Grid container 
					  		   direction="column-reverse"
						       justify="space-evenly"
						       alignItems="stretch" />}
				   showFileNamesInPreview={true}
			       showAlerts={false}
			       useChipsForPreview ={false}
			       />
			</div>
	    );
	  }
}