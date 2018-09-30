import React, { Component } from 'react';
import Utils from '../lib/Utils';
import Loading from '../ui/Loading';
import WikiLinksList from '../ui/WikiLinksList';


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
    console.log('load links ', payload);
    this.setState({
      isLoaded: payload.length > 0,
      links: [...payload]
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
    return (
      this.state.isLoading
        ? <Loading/>
        : <WikiLinksList isLoaded={this.state.isLoaded} items={this.state.links}/>
    );
  }
};