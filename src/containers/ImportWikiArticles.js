import React, { Component } from 'react';
import './ImportWikiArticles.css';
import utils from "../lib/Utils";
import Papa from 'papaparse';
import wu from '../lib/WikiUtils';
import LoadingButton from '../ui/LoadingButton';

export default class ImportWikiArticles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataToImport: '',
      itemList: [],
      isLoading: false,
      message: ''
    };

    this.clearList = this.clearList.bind(this);
    this.importItems = this.importItems.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
  }

  handleChange = event => {
    let params = {
      ...this.state,
      ...utils.unfoldEvent(event)
    };
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
      console.log('set item list');
      this.setState({ itemList: [ ...results.data ] });
    }
    console.log(results);
  };

  clearList() {
    this.setState( { itemList: [] });
  }

  handleProgress = (msg) => this.setState(msg);

  async importItems() {

    const getCategoriesList = () => [
      'Category',
      'Type',
      'Location',
      'Category_ru',
      'Tag'
    ];

    const splitCategory = (category) => category.split(',').map(c => c.trim());
    const addPrefix = (categoryName, categories) => categories.map(c => categoryName + ':' + c);

    const getExtraCategories = (item) => getCategoriesList()
      .map(c =>
        item[c.toLowerCase()]
          ? addPrefix(c, splitCategory(item[c.toLowerCase()]))
          : []
      )
      .reduce((acc, val) => acc.concat(val), []);


    for(let i=0; i<this.state.itemList.length; i++) {
      if(!this.state.itemList[i].url) {
        continue
      }

      console.log('extra', getExtraCategories(this.state.itemList[i]));


      console.log(`import item ${this.state.itemList[i].url}`);

      console.log('fetching from wiki...');
      this.setState({
        itemList: this.state.itemList.map((item, idx) => ({
          ...item,
          status: idx === i ? 'loading...' : item.status
        }))
      });

      const data = await wu.getArticle(this.state.itemList[i].url);

      console.log('saving...');
      this.setState({
        itemList: this.state.itemList.map((item, idx) => ({
          ...item,
          status: idx === i ? 'saving...' : item.status
        }))
      });

      let result = await wu.saveArticle(data, this.handleProgress, getExtraCategories(this.state.itemList[i]));
      console.log('done', result);

      this.setState({
        itemList: this.state.itemList.map((item, idx) => ({
          ...item,
          status: idx === i ? 'saved' : item.status
        }))
      });

    }
  }

  renderForm() {
    return(
      <form onSubmit={this.handleSubmit}>
        <div className="form-field">
          <label htmlFor="dataToImport">CSV Data</label>
          <textarea
            id="dataToImport"
            name="dataToImport"
            onChange={this.handleChange}
            value={this.state.dataToImport}
          >
          </textarea>
        </div>
        <button type="submit">Parse Data</button>
      </form>
    );
  }

  renderItem({ title, url, category, type, location, category_ru, tag, status }) {
    return(
      <div className="items-list--item" key={url}>
        <ul className="item--meta">
          <li className="item--title">{ title }</li>
          <li className="item--lang">{ wu.getLanguage(url).toUpperCase() }</li>
          <li className="item--type">{ type }</li>
          <li className="item--category">{ category }</li>
          <li className="item--location">{ location }</li>
          <li className="item--status">{ status ? status : '' }</li>
        </ul>
      </div>
    );

  }

  renderItemsList() {
    return (
      <div className="items-list">
        <div className="items-list--item" key="headerrow">
          <ul className="item--meta item--header">
            <li className="item--title">title</li>
            <li className="item--lang">lang</li>
            <li className="item--type">type</li>
            <li className="item--category">Category</li>
            <li className="item--location">Location</li>
            <li className="item--status">status</li>
          </ul>
        </div>
        {
          this.state.itemList.map(item => item.url ? this.renderItem(item) : null)
        }
      </div>
    );
  }

  renderImportForm() {
    return(
      <div className="importForm">
        { this.renderItemsList()}
        <LoadingButton
          onClick={this.importItems}
          className="button"
          disabled={false}
          text="Import Articles"
          loadingText="importing..."
          isLoading={this.state.isLoading}
        />

        <button onClick={this.clearList}>
          Cancel
        </button>
        <div>{ this.state.message }</div>
      </div>
    );
  }

  render() {
    return (
      <div className="import-wiki">
        {
          this.state.itemList.length > 0
            ? this.renderImportForm()
            : this.renderForm()
        }
      </div>
    )
  }
}