import React, { Component } from 'react';
import InfiniteProgress from '../ui/InfiniteProgress';
import Utils from "../lib/Utils";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import AssetsList from '../ui/AssetsList';
import AssetPreview from '../ui/AssetPreview';

const styles = {
  data: {
    margin: '96px 24px 24px 24px',
    height: 'calc(100vh - 120px)',
    overflowY: 'hidden'
  },
  fullHeight: {
    height: '100%'
  }
};

export default class Assets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assets: [],
      fullset: [],
      categories: {},
      isLoading: false,
      message: '',
      selectedDocument: null,
      selectedIndex: 0
    };

    this.selectedDocumentId = props.match.params.index || '';

    this._isMounted = false;
  }

  loadDocuments() {
    this.setState({
      isLoading: true,
      assets: [],
      fullset: []
    });

    Utils.listAssets('documents')
      .then(
        ([assets]) => {
          const display = assets.splice(0,Math.min(20, assets.length));

          if(this._isMounted) {
            let idx = 0;
            if(this.selectedDocumentId) {
              idx = display.findIndex(e => e.fileName === this.selectedDocumentId) || 0;
            }

            this.setState({
              isLoading: false,
              assets: display,
              fullset: assets,
              selectedIndex: idx,
              selectedDocument: { ...display[idx] }
            })
          }
        }
      )
      .catch(
        (error) => {
          this.setState({
            isLoading:false,
            message: `error while getting assets list ${error.message}`
          });
          console.log('error while getting assets list', error);
        }
      )
  }

  onSelected(index) {
    let idx = this.state.assets.findIndex(e => e.fileName === index) || 0;

    // get media for selected file and store it
    // pass media data to Asset Preview through state

    this.setState({
      selectedIndex: idx,
      selectedDocument: { ...this.state.assets[idx] }
    });
    this.props.history.push(`/assets/${index}`);
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadDocuments();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div style={styles.data}>
        {
          this.state.isLoading
            ? <InfiniteProgress>loading...</InfiniteProgress>
            : <Paper style={styles.fullHeight}>
              <Grid container style={styles.fullHeight}>
                <Grid item sm={4} style={styles.fullHeight}>
                  <AssetsList
                    assets={this.state.assets}
                    onSelect={this.onSelected.bind(this)}
                    selected={this.state.selectedIndex}
                  />
                </Grid>
                <Grid item sm={8} style={styles.fullHeight}>
                  { this.state.selectedDocument && <AssetPreview asset={this.state.selectedDocument}/>}
                </Grid>
              </Grid>
            </Paper>
        }

      </div>
    );
  }
}