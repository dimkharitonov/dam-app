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

    this.state = {
      selected: props.selected || 0,
      assets: [ ...props.assets ],
    };

    this.onSelect = props.onSelect || (()=>true)
    this._isMounted = false;
  }

  handleListItemClick = (event, payload) => {
    this.setState({
      selected: payload.index
    });
    this.onSelect(payload.document);
  };

  render() {
    return (
      <List style={styles.container}>
        {
          this.state.assets.map((asset,idx) => (
            <ListItem
              button
              selected={this.state.selected === idx}
              onClick={event => this.handleListItemClick(event, {index: idx, document: asset.fileName})}
              key={asset.fileName}
            >
              <ListItemText
                primary={asset.title.replace(/_/gi, ' ')}
                secondary={asset.fileName}
              />
            </ListItem>
          ))
        }
      </List>
    );
  }
}
