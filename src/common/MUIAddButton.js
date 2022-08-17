import React from "react";
import {Button} from '@mui/material';
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
};

class MUIAddButton extends React.Component {
  
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title={'Add'}>
              <Button aria-label={'Add'} className={classes.iconButton}  onClick={this.props.onAddClick}>
                <AddCircleOutlineIcon className={classes.deleteIcon} />
              </Button>
         </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "MUIAddButton" })(MUIAddButton);