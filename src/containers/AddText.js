import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './AddText.css';
import LoadingButton from "../ui/LoadingButton";
import utils from '../lib/Utils';

export default class AddText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'noname',
      body: '',
      author: 'unknown',
      origin: '',
      isLoading: false,
      slug: 'noname',
      message: ''
    };
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

    let document = JSON.stringify({
      title: this.state.title,
      author: this.state.author,
      body: this.state.body
    });

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
      message: ''
    };
    this.setState({
      ...params,
      slug: utils.getSlug(params.title)
    });
  };

  render() {
    return (
      <div className="addtext-form">
        <form onSubmit={this.handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={this.handleChange}
              defaultValue={this.state.title}
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
              defaultValue={this.state.author}
            />
          </div>
          <div className="form-field">
            <label htmlFor="origin">Origin URL</label>
            <input
              id="origin"
              name="origin"
              type="text"
              onChange={this.handleChange}
              defaultValue={this.state.origin}
            />
          </div>
          <div className="form-field">
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              name="body"
              onChange={this.handleChange}
              defaultValue={this.state.body}
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
