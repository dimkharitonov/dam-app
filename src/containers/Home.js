import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Utils from '../lib/Utils';
import wu from '../lib/WikiUtils';
import { FaSpinner } from 'react-icons/fa';
import { S3Image } from 'aws-amplify-react'
import { HomeMap } from './HomeMap';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typeToLoad: 'documents',
      type: 'documents',
      assets: [],
      isLoaded: false,
      message: ''
    };

    this._isMounted = false;
    this.loadAssets = this.loadAssets.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
  }

  onChangeType(event) {
    const type = event.target.getAttribute('data-type') || 'documents';
    const typeToLoad = type === 'media' ? 'media' : 'documents';

    if(this.state.typeToLoad !== typeToLoad) {
      this.setState({ isLoaded: false, typeToLoad, type });
      this.loadAssets(typeToLoad);
    } else {
      this.setState(
        { type }
      )
    }
  }

  getSelectedState(type) {
    return type === this.state.type ? 'tab__selected' : '';
  }

  getImageKey(file, extension) {
    const filePrefix = ['.jpg','.jpeg','.png'].reduce((acc, val) =>  acc || val === extension.toLowerCase() , false)
      ? 'thumbnails/240/'
      : 'media/';

    const imageKey = [filePrefix, file, extension].join('');
    return imageKey;
  }

  loadAssets = async (fileType='documents') => {
    console.log('load assets ', fileType);
    try {
      const assets = await Utils.listAssets(fileType === 'media' ? fileType : 'documents');
      console.log('got', assets);
      if(this._isMounted) {
        console.log('set state ');
        this.setState({
          assets,
          type: fileType,
          isLoaded: true
        });
      }
    } catch (e) {
      this.setState({
        isLoaded:true,
        message: `error while getting assets list ${e.message}`
      });
      console.log('error while getting assets list', e);
    }
  };

  componentDidMount = async () => {
    this._isMounted = true;
    try {
      await this.loadAssets('documents');
    } catch(e) {
      console.log('Error while getting assets', e);
    }
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  renderAssets() {
    switch (this.state.type) {
      case 'media':
        return this.renderMediaList();
      case 'map':
        return this.renderMap();
      default:
        return this.renderDocumentList();
    }
  }

  renderMap() {
    return (
      <div className="assets-map">
        <HomeMap isMarkerShown assets={this.state.assets}/>
      </div>
    );
  }

  renderDocumentList() {
    return (
      <div className="assets-list">
        <div className="assets-list--asset" key="headerrow">
          <ul className="asset--meta meta--header">
            <li className="meta--title">title</li>
            <li className="meta--type">locale</li>
            <li className="meta--file">file</li>
            <li className="meta--coordinates">coordinates</li>
            <li className="meta--type">Images</li>
            <li className="meta--type">Created</li>
          </ul>
        </div>
        {this.state.assets.map(asset => this.renderDocument(asset))}
      </div>
    );
  }

  renderMediaList() {
    return(
      <div className="media-cards">
        <div className="page-nav">
          Total { this.state.assets.length } assets. Show 1–100
        </div>
        {this.state.assets.splice(0,Math.min(100, this.state.assets.length)).map(asset => this.renderMedia(asset))}
      </div>
    );
  }

  renderLander() {
    return(
      <div className="lander-page">
        <h2>no assets for awhile</h2>
        {
          this.state.message
            ? <p>{ this.state.message }</p>
            : ''
        }
      </div>
    );
  }

  renderLoading() {
    return(
      <div className="assets__loading">
        <FaSpinner className="spinning" /> loading...
      </div>
    );
  }

  renderDocument({fileName, fileType, origin, extension, title, categories, coordinates, summary, relatedImages, created}) {
    const { lat, lon } = coordinates ? JSON.parse(coordinates) : {};

    const formatCoordiates = (lat, lon) => {
      return (lat && lon)
        ? <a href={`https://www.google.com/maps/@${lat},${lon},13z`} target="_blank" rel="noopener noreferrer">
          {lat},{lon}
          </a>
        : '-';
    };

    const reduceTextByWordsCount = (text, count) => {
      const words = (text && text.split(' ')) || [];
      return words.slice(0, Math.min(count, words.length)).join(' ') + (count < words.length ? '...' : '');
    };

    return(
      <div className="assets-list--asset" key={fileName}>
        <ul className="asset--meta">
          <li className="meta--title">{title}</li>
          <li className="meta--type">{ origin && wu.getLanguage(origin)}</li>
          <li className="meta--file">{fileName}{extension}</li>
          <li className="meta--coordinates">{ formatCoordiates(lat, lon) }</li>
          <li className="meta--type">{ Array.isArray(relatedImages) ? relatedImages.length : '-' }</li>
          <li className="meta--type">{ new Date(created).toLocaleDateString() }</li>
        </ul>
        <div className="asset--summary">{ reduceTextByWordsCount(summary, 18) }</div>
      </div>
    );
  }

  renderMedia({fileName, extension, title, created}) {
    return(
      <div className="media-cards--card" key={fileName}>
        <div className="card--info">
          <h2 className="info--title">{title}</h2>
          <p className="info--details">File {fileName}{extension}</p>
          <p className="info--details">Created { new Date(created).toLocaleDateString() }</p>
        </div>
        <div className="card--preview">
          <S3Image imgKey={this.getImageKey(fileName, extension)} />
        </div>
      </div>
    )
  }

  render() {
    console.log('home render', this.assets);
    return (
      <div className="Home">
        <div className="navbar"><Link className="navbutton" to="/add-text">New document</Link> <Link className="navbutton" to="/import-wiki-articles">Import Wiki Articles</Link></div>
        <div className="home--title">
          <h1>Assets</h1>
          <div className="list-tabs">
            <div className={'list-tabs--tab ' + this.getSelectedState('documents')} data-type="documents" onClick={this.onChangeType}>
              Documents
            </div>
            <div className={'list-tabs--tab ' + this.getSelectedState('media')} data-type="media" onClick={this.onChangeType}>
              Media
            </div>
            <div className={'list-tabs--tab ' + this.getSelectedState('map')} data-type="map" onClick={this.onChangeType}>
              Map
            </div>
          </div>
        </div>
        { this.state.isLoaded
          ? (this.state.assets.length > 0 ? this.renderAssets() : this.renderLander())
          : this.renderLoading()
        }
      </div>
    );
  }
};