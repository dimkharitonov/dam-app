import React from 'react';
import wu from '../lib/WikiUtils';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import OpenInNew from '@material-ui/icons/OpenInNew';
import IconButton from "@material-ui/core/IconButton/IconButton";

import AssetTaxonomies from './AssetTaxonomies';
import AssetMedia from './AssetMedia';

const styles = {
  fullHeight: {
    height: '100%'
  },
  preview: {
    height: 'calc(100% - 48px)',
    margin: '24px 48px',
    padding: '24px',
    overflowY: 'scroll'
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

      <AssetTaxonomies
        taxonomies={wu.parseCategories(asset.categories)}
      />

      {
        asset.relatedImages &&
        <AssetMedia
          images={asset.relatedImages}
        />
      }

      { console.log('categories', wu.parseCategories(asset.categories))}
    </Paper>
  </div>
);

export default AssetPreview;
