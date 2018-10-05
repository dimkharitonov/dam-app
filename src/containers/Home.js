import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Utils from '../lib/Utils';
import { HomeMap } from './HomeMap';
import DocumentList from '../ui/DocumentList';
import MediaList from '../ui/MediaList';
import HomeTabs from '../ui/HomeTabs';
import TaxonomiesStat from '../ui/TaxonomiesStat';
import InfiniteProgress from '../ui/InfiniteProgress';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typeToLoad: 'documents',
      type: 'documents',
      assets: [],
      categories: {},
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

  loadAssets = async (fileType='documents') => {
    console.log('load assets ', fileType);
    try {
      const assets = await Utils.listAssets(fileType === 'media' ? fileType : 'documents');
      console.log('got', assets);
      if(this._isMounted) {
        console.log('set state ');
        this.setState({
          assets,
          categories: fileType === 'documents' ? this.processCategories(assets) : {},
          typeToLoad: fileType,
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

  processCategories(docs) {
    const data = docs.map(d => this.processCategory(d.categories));
    let catsData = {};

    for (let i = 0; i < data.length; i++) {
      Object.keys(data[i]).forEach(key => {
        catsData[key] = catsData[key] || {};
        Object.keys(data[i][key]).forEach(item => {
          catsData[key][item] = catsData[key][item] ? catsData[key][item] + 1 : 1;
        })
      })
    }

    return catsData;
  };

  processCategory(cats) {
    return cats.map(cat => {
      // split to taxonomy type and items
      let parts = cat.split(':');
      return {
        type: parts[0].trim(),
        items: parts[1].split(',').map(i => i.trim())
      }
    }).reduce((acc, value) => {
      // count number of categories by type
      if(!acc[value.type]) {
        acc[value.type] = {}
      }

      for(let i=0; i<value.items.length; i++) {
        acc[value.type][value.items[i]] =
          acc[value.type][value.items[i]]
            ? acc[value.type][value.items[i]] += 1
            : 1;
      }

      return acc;
    }, {})
  };

  /* =============
      RENDER
   */
  renderAssets() {
    switch (this.state.type) {
      case 'media':
        return <MediaList assets={this.state.assets}/>;
      case 'map':
        return this.renderMap();
      case 'cats':
        return <TaxonomiesStat stats={this.state.categories}/>
      default:
        return <DocumentList assets={this.state.assets}/>;
    }
  }

  renderMap() {
    return (
      <div className="assets-map">
        <HomeMap isMarkerShown assets={this.state.assets}/>
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

  render() {
    return (
      <div className="Home">
        <div className="navbar"><Link className="navbutton" to="/add-text">New document</Link> <Link className="navbutton" to="/import-wiki-articles">Import Wiki Articles</Link></div>

        <div className="home--title">
          <h1>Assets</h1>
          <HomeTabs onClick={this.onChangeType.bind(this)} checkState={this.getSelectedState.bind(this)} />
        </div>
        { this.state.isLoaded
          ? (this.state.assets.length > 0 ? this.renderAssets() : this.renderLander())
          : <InfiniteProgress>loading ...</InfiniteProgress>
        }
      </div>
    );
  }
};