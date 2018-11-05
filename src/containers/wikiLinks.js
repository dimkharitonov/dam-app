import React, { Component } from 'react';
import Utils from '../lib/Utils';
import wu from '../lib/WikiUtils';
import InfiniteProgress from '../ui/InfiniteProgress';
import DataTable from './DataTable';
import WikiLinksDownload from '../ui/WikiLinksDownload';

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
      isDownloading: false,
      itemsToDownload: 0,
      downloadIndex: 0,
      requestForCancel: false,
      downLoadMessage: '',
      cancelMessage: '',
      links: []
    };

    this._isMounted = false;
    this.downloading = {
      queue: [],
      requestForCancel: false,
      index: 0,
      isError: false,
      onDone: null
    }
  }

  loadLinks = payload => {
    this.setState({
      isLoaded: payload.length > 0,
      isLoading: false,
      links: payload.map(e => ({ ...e, articleCreatedTxt: new Date(Number(e.articleCreated)).toLocaleDateString() }))
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

  getLinksFromDocument = (document) => {
    const links = document.langlinks.filter((i) => ['en', 'de', 'ru', 'sv', 'da'].reduce(
      (acc, val) => acc || val === i.lang,
      false
    ));

    const locale = document.articleLocale;

    const buildURL = ({lang, title}) => [
      'https://',
      lang,
      '.wikipedia.org/wiki/',
      encodeURIComponent(title)
    ].join('');

    const isNonSystem = ({title}) => title.match(/^\w+:\w/) === null;

    const isNewLink = ({articleID}) => this.state.links.find(
      (item) => articleID === item.articleID
    ) === undefined;

    const meta = {
      articleCreated: Date.now(),
      articleLocation: document.articleLocation,
      articleStatus: "new",
      articleType: 'Linked'
    };

    return [
      ...links,
      ...document.links.map(i => ({lang: locale, title: i}))
    ]
      .filter(isNonSystem)
      .map(link => ({
        ...meta,
        articleID: buildURL(link),
        articleTitle: link.title,
        articleLocale: link.lang
      }))
      .filter(isNewLink);
  };

  importWikiArticles = (selected, onDone) => {
    if(!Array.isArray(selected)) {
      return;
    }

    const getSelectedItems = (selectedItems) => this.state.links
      .filter(
        (item, idx) => selectedItems.reduce(
          (acc, value) => acc || value === item.articleID,
          false
        )
      );

    this.downloading.queue = getSelectedItems(selected);
    this.downloading.index = 0;
    this.downloading.onDone = onDone;

    this.setState({
      isDownloading: true,
      itemsToDownload: selected.length
    });
    console.log('request to import articles', selected.length);

    this.importWikiArticlesNext(onDone);
  };

  importWikiArticlesLogger = function({message}) {
    this.setState({
      downLoadMessage: message
    })
  };

  importWikiArticlesCancel = () => {
    if(this.downloading.isError) {
      this.importWikiArticlesDone()
    } else {
      this.downloading.requestForCancel = true;
      this.setState({cancelMessage: 'please wait till the end of the current operation'});
    }
  };

  importWikiArticlesNext = () => {
    if(!this.downloading.requestForCancel && this.downloading.queue.length) {
      const [item, ...rest] = this.downloading.queue;

      console.log('Download', item);
      this.downloading.queue = [...rest];
      this.downloading.index++;

      this.importWikiArticlesLogger({message: 'downloading ' + item.articleTitle});

      wu.importWikiArticle(item, this.importWikiArticlesLogger.bind(this))
        .then(
          (result) => {
            console.log('updating status to uploaded', item);
            this.importWikiArticlesLogger({message: 'updating status'});
            item.articleStatus = 'uploaded';

            const newLinks = this.getLinksFromDocument({
              ...result.document,
              articleLocale: item.articleLocale,
              articleLocation: item.articleLocation
            });


            this.setState({
              links: this.state.links.map((link) => ({
                  ...link,
                  status: link.articleID === item.articleID ? item.status : link.status
                }))
            });

            return Utils.bulkSaveWikiLinks([
              item,
              ...newLinks
            ]);
          }
        )
        .then(
          (result) => {
            console.log('result of saving links (non-saved)', result, 'go next');
            this.importWikiArticlesNext();
          }
        )
        .catch(
          (error) => {
            console.log('error', error);
            this.importWikiArticlesLogger({message: `error while downloading ${item.articleID}: ${error}`});
            this.downloading.isError = true;
          }
        );

      this.setState({
        downloadIndex: this.downloading.index
      });

    } else {
      console.log('Call done');
      this.importWikiArticlesDone();
    }
  };

  importWikiArticlesDone = () => {
    console.log('Done downloading');
    this.setState({
      requestForCancel: false,
      isDownloading: false,
      downloadMessage: '',
      cancelMessage: ''
    });

    try {
      this.requestLinks();
    } catch(e) {
      console.log('Error while getting assets', e);
    }

    if(this.downloading.onDone) {
      this.downloading.onDone(this.downloading.queue);
    }
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
        label: 'Title',
        showExternalLink: true,
        externalLinkField: 'articleID'
      },
      {
        id: 'articleLocale',
        numeric: false,
        disablePadding: true,
        label: 'Locale'
      },
      {
        id: 'articleCreatedTxt',
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
              onDownloadClick={this.importWikiArticles}
            />
        }
        <WikiLinksDownload
          open={ this.state.isDownloading }
          onCancel={ this.importWikiArticlesCancel }
          total={ this.state.itemsToDownload }
          index={ this.state.downloadIndex }
          message={ this.state.downLoadMessage }
          cancelMessage = { this.state.cancelMessage }
        />

      </div>
    );
  }
};