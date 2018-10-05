import React, { Component } from 'react';
import Utils from '../lib/Utils';
import InfiniteProgress from '../ui/InfiniteProgress';
import WikiLinksList from '../ui/WikiLinksList';

const styles = {
  loading: {
    margin: '5rem',
    textAlign: 'center',
    width: '80%'
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
    return (
      this.state.isLoading
        ? <div style={styles.loading}><InfiniteProgress>loading...</InfiniteProgress></div>
        : <WikiLinksList isLoaded={this.state.isLoaded} items={this.state.links}/>
    );
  }
};