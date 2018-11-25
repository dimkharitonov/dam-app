import React, { Component } from 'react';
import InfiniteProgress from '../ui/InfiniteProgress';
import Utils from "../lib/Utils";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';

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
  },
  height20p: {
    height: '20%'
  },
  height10p: {
    height: '10%'
  },
  height70p: {
    height: '70%'
  },
  footer: {
    height: '10%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  }
};

export default class Assets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assets: [],
      categories: {},
      isLoading: false,
      message: '',
      selectedDocument: null,
      selectedIndex: 0,
      recordsNumber: 0,
      page: 0,
      pages: 0,
      rowsPerPage: 0
    };

    this.selectedDocumentId = props.match.params.index || '';

    this._isMounted = false;
    this.assets = [];
    this.page = 0;
    this.rowsPerPage = 25;
    this.pages = 0;
  }

  loadDocuments() {
    this.setState({
      isLoading: true,
      assets: []
    });

    Utils.listAssets('documents')
      .then(
        ([assets]) => {
          this.assets = assets;
          this.pages = Math.floor(assets.length / this.rowsPerPage + 0.99);

          if(this._isMounted) {
            this.updateList();
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

  updateList() {
    let idx = 0;
    const display = [...this.assets].splice(this.page * this.rowsPerPage, Math.min(this.rowsPerPage, this.assets.length - this.page * this.rowsPerPage));
    if(this.selectedDocumentId) {
      idx = display.findIndex(e => e.fileName === this.selectedDocumentId) || 0;
    }

    console.log('to display ', display);
    this.setState({
      isLoading: false,
      assets: display,
      selectedIndex: idx,
      selectedDocument: { ...display[idx] },
      page: this.page,
      recordsNumber: this.assets.length,
      rowsPerPage: this.rowsPerPage,
    })
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

  handleChangePage = (event, page) => {
    if(!this._isMounted) {
      return;
    }
    this.page = Math.min(Math.max(page,0), this.pages);
    this.updateList();
  };

  handleChangeRowsPerPage = event => {
    if(!this._isMounted) {
      return;
    }
    this.rowsPerPage = event.target.value;
    this.pages = Math.floor(this.assets.length / this.rowsPerPage + 0.99);
    this.updateList();
  };

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
                <Grid item sm={4} style={styles.fullHeight} container>
                  <Grid item sm={12} style={styles.height20p}>
                    filter
                  </Grid>
                  <Grid item sm={12} style={styles.height70p}>
                    <AssetsList
                      assets={this.state.assets}
                      onSelect={this.onSelected.bind(this)}
                      selected={this.state.selectedIndex}
                    />
                  </Grid>
                  <Grid item sm={12} style={styles.footer}>
                    <TablePagination
                      component="div"
                      count={this.state.recordsNumber}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.page}
                      backIconButtonProps={{
                        "aria-label": "Previous Page"
                      }}
                      nextIconButtonProps={{
                        "aria-label": "Next Page"
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </Grid>

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