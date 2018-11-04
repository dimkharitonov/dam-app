import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  dialogText: {
    paddingBottom: 48
  },
  content: {
    height: 180,
    width: 480,
    maxWidth: '100%'
  }
};

const WikiLinksDownload = ({open, index, total, message, onCancel, cancelMessage}) => (
  <div>
    <Dialog
      open={open}
      onClose={onCancel}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >

      <DialogTitle id="alert-dialog-title">{'Import Wiki Articles'}</DialogTitle>
      <DialogContent style={styles.content}>
        <DialogContentText id="alert-dialog-description" style={styles.dialogText}>
          Downloading {index} from {total} articles.<br/>
          { message } <br/>
          { cancelMessage }
        </DialogContentText>
        <LinearProgress variant="determinate" value={ 100 * index / total } />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default WikiLinksDownload;