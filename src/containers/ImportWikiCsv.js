import React, {Component} from 'react';
import ImportCsvForm from '../ui/ImportCsvForm';
import WikiLinksListItems from '../ui/WikiLinksListItems';
import LoadingButton from '../ui/LoadingButton';
import utils from "../lib/Utils";
import wu from '../lib/WikiUtils';
import Papa from "papaparse";

const styles = {
  button: {
    margin: '1rem'
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
      message: ''
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

  handleSubmit = event => {
    event.preventDefault();
    console.log('submit');
    const results = Papa.parse(this.state.dataToImport, {
      header: true
    });
    if(results.data.length>0) {
      this.setState({ itemList: [ ...results.data.filter(({url}) => url )] });
    }
  };

  saveItems = async () => {
    console.log('save items');
    const chunkSize = 4;
    let chunks = utils.chunkArray(this.state.itemList, chunkSize);
    console.log(chunks);

    this.setState({ isSaving: true });

    for(let i=0; i<chunks.length; i++) {
      let params = chunks[i].map(({title, url, category, type, location, category_ru, tag})=>({
        articleLocale: wu.getLanguage(url),
        articleID: url,
        articleTitle: title || null,
        articleType: type || null,
        articleCategory: category || null,
        articleCategoryRU: category_ru || null,
        articleLocation: location || null,
        articleTag: tag || null,
        articleStatus: 'new',
        articleCreated: Date.now()
      }));

      console.log('params', params);
      try {
        await utils.createWikiLinks(params);
        console.log('saved');
        this.setState({
          message: `saved ${chunkSize * (i+1)} from ${this.state.itemList.length} links`
        })
      } catch (e) {
        console.log('can not save links', e);
        this.setState({
          message: `error while saving ${i}th set of links`
        })
      }

      this.setState({
        isSaving: false,
        message: ''
      })
    }
  };

  render() {
    return this.state.itemList.length > 0
      ? (<div>
        <WikiLinksListItems items={this.state.itemList}/>
        <LoadingButton
          style={ styles.button }
          onClick={this.saveItems}
          className="button"
          disabled={this.state.isSaving}
          text="Save Links"
          loadingText="saving..."
          isLoading={this.state.isSaving}
        />
        <div style={styles.message}>{this.state.message}</div>
      </div>)
      : (<ImportCsvForm handleChange={this.handleChange.bind(this)} data={this.state.dataToImport} handleSubmit={this.handleSubmit.bind(this)}/>);
  }
}

