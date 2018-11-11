import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InfiniteProgress from "./InfiniteProgress";
import u from '../lib/Utils';
import { S3Image } from 'aws-amplify-react'
import './AssetMedia.css'
import OpenInNew from '@material-ui/icons/OpenInNew';
import IconButton from "@material-ui/core/IconButton/IconButton";

const styles = {
  unit: {
    marginTop: 48
  },
  back: {
    backgroundColor: 'rgba(0,0,0,0.29)',
    height: '100%'
  },
  icon: {
    color: 'rgba(255,255,255,0.87)'
  }
};

export default class AssetMedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      images: AssetMedia.convertArrayToObject(props.images),
      isNeededToLoad: true
    };

    this._isMounted = false;
  }

  static extractIds(images) {
    return images
      .map(i => i.split('/')[1])
      .map(i => i.split('.')[0]);
  }

  static convertArrayToObject(images) {
    const imageIds = AssetMedia.extractIds(images)

    return imageIds.map(i => ({
      id: i,
      isLoaded: false,
      data: {}
    }))
  }

  static getDerivedStateFromProps(props, state) {
    const imageIds = AssetMedia.extractIds(props.images);

    if(props.images.length !== state.images.length ||
      imageIds.reduce((acc, val, idx) => acc || val !== state.images[idx].id, false)) {
        return {
          images: AssetMedia.convertArrayToObject(props.images),
          isNeededToLoad: true
        }
    }

    return null;
  }


  async loadMedia() {
    let chunks = u.chunkArray(AssetMedia.extractIds(this.props.images), 50);
    let data = {};

    const buildItem = i => {
      return data[i.id] ? {
        id: i.id,
        isLoaded: true,
        data: data[i.id]
      } : i
    };

    this.setState({
      isNeededToLoad: false
    });

    for(let i=0; i<chunks.length; i++) {
      try {
        data = await u.listAssets('media', chunks[i]);

        data = data.reduce((acc, val) => {
          acc[val.fileName] = val;
          return acc;
        }, {});

        if(this._isMounted) {
          this.setState({
            images: [
              ...this.state.images
                .map(buildItem)
            ]
          })
        }
      }
      catch (e) {
        console.log(e);
      }
    }

  }

  componentDidMount() {
    this._isMounted = true;
    this.loadMedia();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.isNeededToLoad) {
      this.loadMedia();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div style={styles.unit}>
        <Typography variant={'h5'} gutterBottom>
          Media
        </Typography>

        <GridList cellHeight={240} cols={3}>
          {
            this.state.images.map(
              (img, idx) => (
                img.isLoaded
                  ?
                  <div key={idx} className='AssetPreview'>
                    <GridListTile style={styles.back}>
                      <S3Image
                        imgKey={u.getImageKey(img.data.fileName, img.data.extension)}
                      />

                      <GridListTileBar
                        title={img.data.title}
                        titlePosition={'bottom'}
                        actionIcon={
                          <IconButton size="small" href={img.data.origin} target={'_blank'}>
                            <OpenInNew style={ styles.icon }/>
                          </IconButton>
                        }
                      />
                    </GridListTile>

                  </div>
                  :
                    <div key={idx}><InfiniteProgress>loading...</InfiniteProgress></div>
              )
            )
          }
        </GridList>
      </div>
    );
  }
}
