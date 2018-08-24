import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AddText.css';
import LoadingButton from "../ui/LoadingButton";
import utils from '../lib/Utils';
import wu from '../lib/WikiUtils';


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
      'handleProgress'
    ].map(f => this[f] = this[f].bind(this));

  };

  handleProgress = (msg) => this.setState(msg);

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true});

    let result = await wu.saveArticle(this.state, this.handleProgress);

    console.log('Result of saving', result);

    this.setState(
      { isLoading: false,
        message: result.success ? 'Saved successfully' : `ERROR: ${result.error.message}`
      });
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

    this.setState({isFetching: true});

    const data = await wu.getArticle(wikiPage);

    this.setState({
      ...data,
      isFetching: false,
      fetchingMessage: data.message
    });

  };


  renderImage = (image, idx) => {
    return (
      <img key={idx} src={image.imageinfo[0].url} alt={image.title} width="200"/>
    );
  };

  renderImageList = (images) => {
    return images && images.length > 0
      ? images.map((img, idx) => this.renderImage(img,idx))
      : 'no images'
  };

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

          <div className="article-images">
            { this.state.rawImages && this.state.rawImages.length } image(s)
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
