import React from "react";
import {Button} from '@mui/material';
import Tooltip from "@material-ui/core/Tooltip";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
};

class MUISaveButton extends React.Component {
  
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title={'Save'}>
              <Button aria-label={'Save'} className={classes.iconButton}  onClick={this.props.onSaveClick}>
                <SaveOutlinedIcon className={classes.deleteIcon} />
              </Button>
         </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "MUISaveButton" })(MUISaveButton);