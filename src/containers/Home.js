import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Utils from "../lib/Utils";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'documents',
      assets: []
    };

    this._isMounted = false;
    this.loadAssets = this.loadAssets.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
  }

  onChangeType(event) {
    this.loadAssets(event.target.getAttribute('data-type') || 'documents');
  }

  getSelectedState(type) {
    return type === this.state.type ? 'tab__selected' : '';
  }

  loadAssets = async (fileType='documents') => {
    console.log('load assets ', fileType);
    try {
      const assets = await Utils.listAssets(fileType);
      console.log('got', assets);
      if(this._isMounted) {
        console.log('set state ');
        this.setState({
          assets,
          type: fileType
        });
      }
    } catch (e) {
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


  renderAssetsList() {
    return (
      <div className="assets-list">
        <div className="assets-list--asset" key="headerrow">
          <ul className="asset--meta meta--header">
            <li className="meta--title">title</li>
            <li className="meta--type">type</li>
            <li className="meta--file">file</li>
            <li className="meta--coordinates">coordinates</li>
          </ul>
        </div>
        {this.state.assets.map(asset => this.renderAsset(asset))}
      </div>
    );
  }

  renderLander() {
    return(
      <div className="lander-page">
        <h2>no assets for awhile</h2>
      </div>
    );
  }

  renderAsset({fileName, extension, title, categories, coordinates, summary}) {
    const [ftype, fname] = fileName.split('/');
    const { lat, lon } = coordinates ? JSON.parse(coordinates) : {};

    const formatCoordiates = (lat, lon) => {
      return (lat && lon)
        ? <a href={`https://www.google.com/maps/@${lat},${lon},13z`} target="_blank" rel="noopener noreferrer">
          {lat},{lon}
          </a>
        : '-';
    };

    return(
      <div className="assets-list--asset" key={fileName}>
        <ul className="asset--meta">
          <li className="meta--title">{title}</li>
          <li className="meta--type">{ftype}</li>
          <li className="meta--file">{fname}{extension}</li>
          <li className="meta--coordinates">{ formatCoordiates(lat, lon) }</li>
        </ul>
        { ftype === 'documents'
          ? <div className="asset--summary">{summary.substr(0, Math.min(128, summary.length))}...</div>
          : <div className="asset--preview">image preview</div>
        }
      </div>
    );
  }

  render() {
    console.log('home render', this.assets);
    return (
      <div className="Home">
        <div className="navbar"><Link className="navbutton" to="/add-text">New document</Link> <Link className="navbutton" to="/import-wiki-articles">Import Wiki Articles</Link></div>
        <div className="home--title">
          <h1>Assets List</h1>
          <div className="list-tabs">
            <div className={'list-tabs--tab ' + this.getSelectedState('documents')} data-type="documents" onClick={this.onChangeType}>
              Documents
            </div>
            <div className={'list-tabs--tab ' + this.getSelectedState('media')} data-type="media" onClick={this.onChangeType}>
              Media
            </div>
          </div>
        </div>
        { this.state.assets.length > 0 ? this.renderAssetsList() : this.renderLander() }
      </div>
    );
  }
};