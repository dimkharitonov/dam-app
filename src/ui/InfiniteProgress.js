import React from 'react';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  progressBar: {
    height: '120px',
    textAlign: 'center'
  },
  comments: {
    display: 'inline-block',
    marginLeft: '12px'
  }
};

const InfiniteProgress = ({children}) => (
  <Grid container alignItems={"center"} style={styles.progressBar}>
    <Grid item sm={12}>
      <CircularProgress size={18} color={"secondary"}/>
      <div style={styles.comments}>
        <Typography variant={"body1"}>
          { children }
        </Typography>
      </div>
    </Grid>
  </Grid>
);

export default InfiniteProgress;