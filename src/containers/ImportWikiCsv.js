import React, {Component} from 'react';
import ImportCsvForm from '../ui/ImportCsvForm';
import WikiLinksListItems from '../ui/WikiLinksListItems';
import LoadingButton from '../ui/LoadingButton';
import utils from "../lib/Utils";
import wu from '../lib/WikiUtils';
import Papa from "papaparse";

import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography/Typography";
import IconButton from "@material-ui/core/IconButton/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';

const styles = {
  page: {
    margin: '96px 24px 24px 24px'
  },
  form: {
    marginTop: '24px',
    padding: '24px'
  },
  buttons: {
    marginRight: '24px'
  },
  message: {
    margin: '1rem',
    fontSize: '0.75rem'
  }
};

export default class ImportWikiCsv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataToImport: '',
      itemList: [],
      isSaving: false,
      message: '',
      isWorking: false
    };
  }

  handleChange = event => {
    let params = {
      ...this.state,
      ...utils.unfoldEvent(event)
    };
    console.log('data change', params);
    this.setState({
      ...params
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log('submit');

    const results = Papa.parse(this.state.dataToImport, {
      header: true
    });


    if(results.data.length>0) {
      this.setState({isWorking: true});

      console.log('fetch loaded assets');
      const assets = await utils.listAssets('documents');

      const lookup = (el, data) => el.origin === data;

      const getStatusAndDate = url => {
        let isUploaded = assets.find(el => lookup(el, url));
        return isUploaded
          ? {
            articleStatus: 'uploaded',
            articleCreated: isUploaded.created
          }
          : {
            articleStatus: 'new',
            articleCreated: Date.now()
          }
      };

      let givenUrls = [];
      const noDublicates = url => {
        if(givenUrls.find(el => el === url)) {
          return false;
        } else {
          givenUrls = [ ...givenUrls, url ];
          return true;
        }
      };

      this.setState({
        itemList: [ ...results.data.filter(({url}) => url && noDublicates(url) )]
          .map(({title, url, category, type, location, category_ru, tag})=>({
            articleLocale: wu.getLanguage(url),
            articleID: url,
            articleTitle: title || null,
            articleType: type || null,
            articleCategory: category || null,
            articleCategoryRU: category_ru || null,
            articleLocation: location || null,
            articleTag: tag || null,
            ...getStatusAndDate(url)
          })),
        isWorking: false,
        message: ''
      });
    }
  };

  handleClearData = () => {
    this.setState({
      itemList: []
    })
  };

  saveItems = async () => {
    console.log('save items');
    const chunkSize = 20;
    let chunks = utils.chunkArray(this.state.itemList, chunkSize);
    console.log(chunks);
    let unsaved = [];
    let saved = 0;

    this.setState({ isSaving: true });

    for(let i=0; i<chunks.length; i++) {
      let params = chunks[i];

      console.log('params', params);
      try {
        await utils.createWikiLinks(params);
        console.log('saved');
        saved += chunks[i].length;

        this.setState({
          message: `saved ${chunkSize * (i+1)} from ${this.state.itemList.length} links`
        })
      } catch (e) {
        console.log('can not save links', e);
        this.setState({
          message: `error while saving ${i}th set of links`
        });
        unsaved = [ ...unsaved, ...chunks[i] ];
      }
    }
    this.setState({
      isSaving: false,
      message: `successfully saved ${saved} links`,
      itemList: unsaved,
      dataToImport: ''
    })
  };

  render() {
    return (
      <div style={styles.page}>
        <Typography variant={"title"}>
          <IconButton aria-label="go back" onClick={ this.props.history.goBack } >
            <ArrowBackIcon/>
          </IconButton>
          Add Links as CSV text
        </Typography>
        <Paper style={styles.form}>
          {
            this.state.itemList.length > 0
              ? (<div>
                <WikiLinksListItems items={this.state.itemList}/>
                <LoadingButton
                  style={ styles.buttons }
                  color={'primary'}
                  onClick={this.saveItems}
                  className="button"
                  disabled={this.state.isSaving}
                  text="Save Links"
                  loadingText="saving..."
                  isLoading={this.state.isSaving}
                />
                <Button onClick={this.handleClearData}>Cancel</Button>
                <div style={styles.message}>{this.state.message}</div>
              </div>)
              : (
                <ImportCsvForm
                  handleChange={this.handleChange.bind(this)}
                  handleSubmit={this.handleSubmit.bind(this)}
                  handleCancel={this.props.history.goBack}
                  data={this.state.dataToImport}
                  isWorking={this.state.isWorking}
                  message={this.state.message}
                />
              )
          }
        </Paper>
      </div>
    )
  }
}

