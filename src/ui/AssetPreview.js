import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import OpenInNew from '@material-ui/icons/OpenInNew';
import IconButton from "@material-ui/core/IconButton/IconButton";

const styles = {
  fullHeight: {
    height: '100%'
  },
  preview: {
    height: 'calc(100% - 48px)',
    margin: '24px 48px',
    padding: '24px'
  }
};

const AssetPreview = ({asset}) => (
  <div style={styles.fullHeight}>
    <Paper style={styles.preview} elevation={1}>
      <Typography variant={"h4"} gutterBottom>
        { asset.title.replace(/_/ig,' ') }
        <IconButton href={asset.origin} target={'_blank'}>
          <OpenInNew/>
        </IconButton>
      </Typography>
      <Typography variant={"body1"} gutterBottom>
        { asset.summary }
      </Typography>


    </Paper>
  </div>
);

export default AssetPreview;
