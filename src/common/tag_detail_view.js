import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    fontSize:15,
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

class TagDetailView extends React.Component {

	constructor(props) {
	    
		super(props);
	   
	    this.state = {
	       showLoading: true,
	       data:[],
	    };
	}
	
render() {
	const { handleClose,open,lLabel,studyTag,showLoading} = this.props;
	
	return (
	    <div>
	      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
	        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
	          {lLabel}
	        </DialogTitle>
	        { showLoading ? " loading" : (
	        <DialogContent dividers>
	            {studyTag.description} <br/><br/>
	            IRB Number # {studyTag.irbInfo}  <br/>
	            Principal Investigator #  {studyTag.principalInvestigator}  <br/>
	            Point of Contact  # {studyTag.pointOfContact}  <br/>
	        </DialogContent>
	        ) }
	        
	        <DialogActions>
	          <Button autoFocus onClick={handleClose} color="primary">
	              Close
	          </Button>
	        </DialogActions>
	      </Dialog>
	    </div>
	  );
  }
}


export default TagDetailView;