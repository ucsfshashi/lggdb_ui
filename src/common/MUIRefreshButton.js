import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SyncIcon from "@material-ui/icons/Sync";
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
  iconButton: {
  },
};

class MUIRefreshButton extends React.Component {
  
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Tooltip title={'Download Csv'}>
              <IconButton aria-label={'Download Csv'} className={classes.iconButton}  onClick={this.props.onDownloadClick}>
                <DownloadIcon className={classes.deleteIcon} />
              </IconButton>
         </Tooltip>
         <Tooltip title={"Refresh Data"}>
          <IconButton className={classes.iconButton} onClick={this.props.onRefreshClick}>
            <SyncIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }

}

export default withStyles(defaultToolbarStyles, { name: "MUIRefreshButton" })(MUIRefreshButton);