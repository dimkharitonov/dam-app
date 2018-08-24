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
      'getFields'
    ].map(f => this[f] = this[f].bind(this));

  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true});

    let meta = {
      title: this.state.title,
      origin: this.state.origin,
      summary: this.state.summary,
      categories: this.state.categories,
      langlinks: this.state.langlinks,
      coordinates: this.state.coordinates,
      fileName: utils.getDocumentFileName(this.state.slug),
      extension: '.json',
      type: 'application/json',
      created: Date.now(),
      author: this.state.author
    };

    let document = {
      ...wu.getFieldsAsHash(this.getFields(), this.state),
      title: this.state.title
    };

    let relatedImages = [];

    try {
      // save images
      if(document.rawImages && document.rawImages.length > 0) {

        for(let i=0; i<document.rawImages.length; i++) {
          let imageMeta = {};

          try {
            const image = document.rawImages[i];

            this.setState({ message: `image ${i+1} of ${document.rawImages.length}: fetching...`});
            let imageFile = await wu.getImage(image.imageinfo[0].url);

            imageMeta = {
              title: wu.getImageTitle(image.title),
              fileName: utils.getMediaFileName(image.pageid || wu.getImageId(image.imageinfo[0].descriptionshorturl)),
              extension: wu.getImageExtension(image.imageinfo[0].url),
              origin: image.imageinfo[0].descriptionurl,
              source: image.imageinfo[0].url,
              type: imageFile.type,
              created: Date.now()
            };

            this.setState({ message: `image ${i+1} of ${document.rawImages.length}: uploading...`});

            let result = await utils.storeData(imageFile, imageMeta, false);
            relatedImages = [
              ...relatedImages,
              result.key
            ];
          } catch (e) {
            this.setState({ message: `ERROR while saving image ${imageMeta}`});
          }
        }
      }

      // save document

      this.setState({ message: 'saving document'});

      meta = {
        ...meta,
        relatedImages: relatedImages
      };

      console.log('document to save', document);

      let result = await utils.storeData(JSON.stringify(document), meta);
      console.log('stored successfull', result);
      this.setState({ isLoading: false, message: 'Saved successfully' });
    } catch (e) {
      console.log('get error ', e);
      this.setState({ isLoading: false, message: `ERROR: ${e.message}` });
    }

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

    const data = await wu.getArticle(wikiPage, this.getFields());

    this.setState({
      ...data,
      isFetching: false,
      fetchingMessage: data.message
    });

  };

  getFields = () => [
    'content',
    'html',
    'categories',
    'fullInfo',
    'coordinates',
    'langlinks',
    'mainImage',
    'rawImages',
    'summary'
  ];

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
