import React from 'react';

import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';


const styles = {
  unit: {
    marginTop: 48
  }
};

const AssetMedia = ({images}) => (
  <div style={styles.unit}>
    <Typography variant={'h5'} gutterBottom>
      Media
    </Typography>

    <GridList cellHeight={200} cols={3}>
      {
        images.map(
          (img, idx) => (
            <GridListTile key={idx} cols={1}>
              image
            </GridListTile>
          )
        )
      }
    </GridList>
  </div>
);

export default AssetMedia;