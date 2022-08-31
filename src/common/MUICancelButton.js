import React from "react";
import {Button} from '@mui/material';
import Tooltip from "@material-ui/core/Tooltip";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
};

class MUICancelButton extends React.Component {
  
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title={'Cancel'}>
              <Button aria-label={'Cancel'} className={classes.iconButton}  onClick={this.props.onCancelClick}>
                <CancelOutlinedIcon className={classes.deleteIcon} />
              </Button>
         </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "MUICancelButton" })(MUICancelButton);