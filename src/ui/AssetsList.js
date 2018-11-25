import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const styles = {
  container: {
    width: '100%',
    height: '100%',
    overflowY: 'scroll'
  }
};

export default class AssetsList extends Component {
  constructor(props) {
    super(props);

    this.onSelect = props.onSelect || (()=>true)
    this._isMounted = false;
  }

  handleListItemClick = (event, payload) => {
    this.onSelect(payload.document);
  };

  render() {
    return (
      <List style={styles.container}>
        {
          this.props.assets.map((asset,idx) => (
            <ListItem
              button
              selected={this.props.selected === idx}
              onClick={event => this.handleListItemClick(event, {index: idx, document: asset.fileName})}
              key={asset.fileName}
            >
              <ListItemText
                primary={asset.title.replace(/_/gi, ' ')}
              />
            </ListItem>
          ))
        }
      </List>
    );
  }
}
