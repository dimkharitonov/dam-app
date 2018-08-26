import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.assets = [...props.assets];
  }

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
        {this.assets.map(asset => this.renderAsset(asset))}
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

    console.log(`coord: ${lat}, ${lon}`);

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
    return (
      <div className="Home">
        <div><Link to="/add-text">New document</Link></div>
        <div className="home--title">
          <h1>Assets List</h1>
        </div>
        { this.assets.length > 0 ? this.renderAssetsList() : this.renderLander() }
      </div>
    );
  }
};