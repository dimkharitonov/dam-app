import React from 'react';

import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

const styles = {
  terms: {
    margin: '8px'
  },
  unit: {
    marginTop: 48
  }
};

const AssetTaxonomies = ({taxonomies}) => (
  <div>
    <Typography variant={'h5'} style={styles.unit} gutterBottom>
      Taxonomies
    </Typography>
    {
      ['Category', 'Location', 'Type'].map(
        (t, idx) => (
          taxonomies[t] &&
          <div key={idx}>
            <Typography variant={'h6'}>
              {t}
              </Typography>
            <div>
              { Object.keys(taxonomies[t]).map(
                (term, i) => (
                  <Chip label={term} key={i} style={styles.terms} variant="outlined"/>
                )
              )}
            </div>
          </div>
        )
      )
    }
  </div>
);

export default AssetTaxonomies;