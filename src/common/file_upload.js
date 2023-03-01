import { DropzoneDialog } from 'material-ui-dropzone';
import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from "axios";



export default class FileUpload extends React.Component {
 
	constructor(props) {
	    super(props);
	    
	    this.state = {
	    	open:false,
	    	files:[],
	    };
	 }
 	
	 async onSave(files) {
	    const {config,value,loginContext} = this.props;
	    
	    const formData = new FormData()
	    for(var x = 0; x<files.length; x++) {
	    	formData.append('file', files[x])
	    }
	    
	    if(value) { // update
		    const headers = { 
		    		  "Content-Type": "multipart/form-data",
		    		  'X-Requested-With':'XMLHttpRequest', 
		               'UCSFAUTH-TOKEN':loginContext.token,
		                'tagId':loginContext.selTag.tagId,
		                 'selRole':loginContext.selRole
		    		};
		    
		    
		    
		       var uploadInfo = await axios.post(loginContext.apiUrl+"/uploadInfo/"+value, formData, { headers })
		    
		      if(uploadInfo) {
		    	  uploadInfo = uploadInfo.data; 
		      }
		       
		    if(uploadInfo && uploadInfo.fileDownloadUri) {
		    	this.props.handleChange(uploadInfo.fileDownloadUri);
		    	this.setState({ open:false});
		    }
		       
	    } else {   // insert 
	    	 const headers = { 
		    		   'X-Requested-With':'XMLHttpRequest', 
		    		   "Content-Type": "multipart/form-data",
		               'UCSFAUTH-TOKEN':loginContext.token,
		                'tagId':loginContext.selTag.tagId,
		                 'selRole':loginContext.selRole
		    		};
		     var uploadInfo = await axios.post(loginContext.apiUrl+"/uploadInfo", formData, { headers })
		   
		     if(uploadInfo) {
		    	  uploadInfo = uploadInfo.data; 
		      }
		     
	    	if(uploadInfo && uploadInfo.fileDownloadUri) {
		    	this.props.handleChange(uploadInfo.fileDownloadUri);
		    	this.setState({ open:false});
		    }
	    }
	 };

	 async setOpen(selectedOption) {
		 const {config,value,loginContext} = this.props;
		 
		 if(selectedOption === true && value) {
			var uploadInfo = await axios.get(loginContext.apiUrl+"/uploadInfo/"+value, 
                     {headers:{
                       'X-Requested-With':'XMLHttpRequest', 
                       'UCSFAUTH-TOKEN':loginContext.token,
                        'tagId':loginContext.selTag.tagId,
                         'selRole':loginContext.selRole,
                     }}
                     );
			 var files = [];
		 
			 if(uploadInfo) {
				 uploadInfo = uploadInfo.data;
			 }
			 
			 
		
			 if(uploadInfo) {
				 if(uploadInfo.childDownloadUris 
					&& uploadInfo.childDownloadUris.length >0) {
					 
					 for(var index in uploadInfo.childDownloadUris) {
						 files.push(loginContext.apiUrl+'/file/'+uploadInfo.childDownloadUris[index].fileDownloadUri);
					 }
				 } else {
					 files.push(loginContext.apiUrl+'/file/'+uploadInfo.fileDownloadUri);
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
			        startIcon={<AddPhotoAlternateIcon />} 
				    onClick={() => this.setOpen(true)} >
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