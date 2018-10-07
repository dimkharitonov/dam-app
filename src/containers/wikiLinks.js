import React, { Component } from 'react';
import Utils from '../lib/Utils';
import InfiniteProgress from '../ui/InfiniteProgress';
import DataTable from './DataTable';

const styles = {
  dataTable: {
    margin: '96px 24px 24px 24px'
  }
};

export default class WikiLinks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isLoading: false,
      links: []
    };

    this._isMounted = false;
  }

  loadLinks = payload => {
    this.setState({
      isLoaded: payload.length > 0,
      isLoading: false,
      links: payload.map(e => ({ ...e, articleCreated: new Date(Number(e.articleCreated)).toLocaleDateString() }))
    });
  };

  handleError = error => {
    this.setState({
      isLoaded:false,
      isLoading: false,
      message: `error while getting assets list ${error.message}`
    });
    console.log('error while getting assets list', error);
  };

  requestLinks = () => {
    console.log('request links ');
    this.setState({isLoading:true});
    return Utils.listWikiLinks(this.loadLinks.bind(this), this.handleError.bind(this));
  };

  componentDidMount = async () => {
    this._isMounted = true;
    try {
      this.requestLinks();
    } catch(e) {
      console.log('Error while getting assets', e);
    }
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  render() {
    const columnData = [
      {
        id: 'articleTitle',
        numeric: false,
        disablePadding: true,
        label: 'Title'
      },
      {
        id: 'articleLocale',
        numeric: false,
        disablePadding: true,
        label: 'Locale'
      },
      {
        id: 'articleCreated',
        numeric: false,
        disablePadding: true,
        label: 'Created'
      },
      {
        id: 'articleType',
        numeric: false,
        disablePadding: true,
        label: 'Type'
      },
      {
        id: 'articleLocation',
        numeric: false,
        disablePadding: true,
        label: 'Location'
      },
      {
        id: 'articleCategory',
        numeric: false,
        disablePadding: true,
        label: 'Category'
      },
      {
        id: 'articleStatus',
        numeric: false,
        disablePadding: true,
        label: 'Status'
      }
    ];

    const { isLoading, links } = this.state;

    return (
      <div style={styles.dataTable}>
        {
          isLoading
            ? <div><InfiniteProgress>loading...</InfiniteProgress></div>
            : <DataTable
              data={ links }
              orderBy={'articleTitle'}
              rowsPerPage={25}
              columnData={columnData}
              tableTitle={'Wiki Links'}
              idKey={'articleID'}
              onAddClick={e => this.props.history.push('/wiki-csv')}
            />
        }
      </div>
    );
  }
};