import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AddText.css';
import LoadingButton from "../ui/LoadingButton";
import utils from '../lib/Utils';
import wiki from 'wikijs';


export default class AddText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wikiPage: '',
      title: 'noname',
      coordinates: '',
      summary: '',
      content: '',
      html: '',
      author: '',
      origin: '',
      isLoading: false,
      slug: 'noname',
      message: '',
      isFetching: false,
      fetchingMessage: ''
    };

    [
      'handleSubmit',
      'handleChange',
      'handleWikiFetch',
      'getFields',
      'getFieldsAsHash'
    ].map(f => this[f] = this[f].bind(this));

  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true});

    let meta = {
      title: this.state.title,
      fileName: this.state.slug,
      extension: '.json',
      type: 'application/json',
      created: Date.now(),
      author: this.state.author
    };

    let document = JSON.stringify(
      this.getFields().reduce((h, f) => {
        console.log(`save ${f} as ${this.state[f]}`);
        h[f] = this.state[f];
        return h;
      }, {})
    );
    console.log('document to save', document);

    utils.storeData(document, meta)
      .then(result => {
        console.log('stored successfull', result);
        this.setState({ isLoading: false, message: 'Saved successfully' });

      })
      .catch(e => {
        console.log('get error ', e);
        this.setState({ isLoading: false, message: `ERROR: ${e.message}` });
      })
  };

  handleChange = event => {
    let params = {
      ...this.state,
      ...utils.unfoldEvent(event),
      message: '',
      fetchingMessage: ''
    };
    this.setState({
      ...params,
      slug: utils.getSlug(params.title)
    });
  };

  handleWikiFetch = async event => {
    event.preventDefault();

    const wikiPage = this.state.wikiPage;

    const getLanguage = (url) => {
      const topLevelParts = url.split('/');
      const domainParts = topLevelParts.length >=3 ? topLevelParts[2].split('.') : [];

      return domainParts.length >=3 ? domainParts[0] : 'en';
    };

    const getPageName = (url) => url.split('/').reverse()[0];

    const getApiUrl = (lang) => 'http://[LNG].wikipedia.org/w/api.php'.replace('[LNG]', lang);

    const fetchPage = async (api, page) => {

      let wikiData = {};

      try {
        const fields = this.getFields();
        wikiData = fields.map(async f => wiki({apiUrl:api}).page(page).then(page => page[f]()));

        wikiData = await Promise.all(wikiData);

        wikiData = fields.reduce((h, f, i) => {
          h[f] = wikiData[i];
          return h;
        }, {})

      } catch(e) {
        console.log(e);
        wikiData = {
          error: e,
          message: e.message
        }
      }

      return wikiData;
    };


    this.setState({isFetching: true});

    const apiUrl = getApiUrl(getLanguage(wikiPage));
    const pageName = getPageName(wikiPage);

    const data = await fetchPage(apiUrl, pageName);

    this.setState({isFetching: false, fetchingMessage: data.message });

    if(!data.error) {
      // update state
      let title = (data.fullInfo && data.fullInfo.name) || pageName.replace('_', ' ');

      this.setState({
        ...this.getFieldsAsHash(data),
        title: title,
        slug: utils.getSlug(title),
        origin: wikiPage,
        coordinates: JSON.stringify(data.coordinates)
      });
    }
  };

  getFields = () => [
    'content',
    'categories',
    'fullInfo',
    'coordinates',
    'langlinks',
    'mainImage',
    'rawImages',
    'summary'
  ];

  getFieldsAsHash = (src) => this.getFields().reduce((h, f)=>{
    h[f] = src[f];
    return h;
  }, {});

  render() {
    return (
      <div className="addtext-form">
        <form onSubmit={this.handleSubmit}>
          <div className="form-field with-button">
            <label htmlFor="wikiPage">Wiki Page URL</label>
            <input
              id="wikiPage"
              name="wikiPage"
              type="text"
              onChange={this.handleChange}
            />
            <LoadingButton
              className="button"
              disabled={this.state.wikiPage.length===0}
              text="Fetch"
              loadingText="fetching..."
              isLoading={this.state.isFetching}
              onClick={this.handleWikiFetch}
            />
            <div className="addtext-form--slug">
              {this.state.fetchingMessage}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={this.handleChange}
              value={this.state.title}
            />
            <div className="addtext-form--slug">
              {this.state.slug}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              name="author"
              type="text"
              onChange={this.handleChange}
              value={this.state.author}
            />
          </div>
          <div className="form-field">
            <label htmlFor="origin">Origin URL</label>
            <input
              id="origin"
              name="origin"
              type="text"
              onChange={this.handleChange}
              value={this.state.origin}
            />
          </div>
          <div className="form-field">
            <label htmlFor="coordinates">Coordinates</label>
            <input
              id="coordinates"
              name="coordinates"
              type="text"
              onChange={this.handleChange}
              value={this.state.coordinates}
            />
          </div>
          <div className="form-field">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              onChange={this.handleChange}
              value={this.state.summary}
            >
            </textarea>
          </div>
          <div className="form-field">
            <label htmlFor="content">Body</label>
            <textarea
              id="content"
              name="content"
              onChange={this.handleChange}
              value={this.state.content}
            >
            </textarea>
          </div>

          <div className="formError">{ this.state.message}</div>

          <LoadingButton
            type="submit"
            className="button"
            disabled={false}
            text="Save"
            loadingText="saving..."
            isLoading={this.state.isLoading}
          />

          <Link to="/">Cancel</Link>
        </form>

      </div>
    );
  }

}
