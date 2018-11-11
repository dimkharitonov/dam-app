import { slugify as sg } from 'transliteration';
import { Storage, API } from 'aws-amplify';

export default {
  getSlug: (fileName) => sg(fileName, { unknown: '_' }),

  getDocumentFileName: (fileName) => 'documents/' + fileName,

  getMediaFileName: (fileName) => 'media/' + fileName,

  unfoldEvent: event => {
    return {
      [event.target.id]: event.target.value
    };
  },

  chunkArray: (arr, len) => {
    let chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, i += len));
    }
    return chunks;
  },

  getImageKey: (file, extension) => {
    const filePrefix = ['.jpg','.jpeg','.png'].reduce((acc, val) =>  acc || val === extension.toLowerCase() , false)
      ? 'thumbnails/240/'
      : 'media/';

    const imageKey = [filePrefix, file, extension].join('');
    return imageKey;
  },

  storeData: async function (body, meta, rewrite = true) {

    const buildFileName = (name, extension) => name + extension;

    console.log(`Trying to save ${buildFileName(meta.fileName, meta.extension)}`);

    if(!rewrite) {
      console.log('no rewrite mode, check for existence');

      try {

        const metafile = await this.getAsset(meta.fileName);
        console.log('API', metafile);

        console.log(`file ${meta.fileName} already exists, skip it`);

        return new Promise(function(resolve, reject) {
          resolve({
            ...metafile,
            key: buildFileName(meta.fileName, '.meta'),
            exist: true
          });
        });

      } catch (e) {
        console.log(`file ${meta.fileName} doesn't exists, save it`);
      }
    }

    return new Promise( (function(resolve, reject) {

      Storage.put(
        buildFileName(meta.fileName, meta.extension),
        body,
        {
          contentType: meta.type
        })

        .then(result => {
          console.log(`document ${buildFileName(meta.fileName, meta.extension)} has been saved`);
          console.log('store meta', meta);

          return Storage.put(
            buildFileName(meta.fileName, '.meta'),
            JSON.stringify({
              ...meta,
              key: result.key
            }),
            {
              contentType: 'application/json'
            })
        })

        .then(result => {
          console.log('Save to API');
          return this.createAsset(meta);
        })

        .then(result => {
          console.log('all done', result);
          resolve({
            ...result,
            key: buildFileName(meta.fileName, '.meta')
          });
        })

        .catch(e => {
          console.log(`Error storing ${meta.fileName} file type ${meta.type}. Origin ${meta.origin}`, e);
          reject(e);
        });

      // clear data
      body = null;
    }).bind(this) );
  },

  getAsset: fileName => {
    return API.get('assets', `/assets/${encodeURIComponent(fileName)}`, {});
  },

  createAsset: asset => {
    console.log('API create', asset);
    return API.post('assets', '/assets/', {
      body: asset
    })
  },

  listAssets: (fileType, items=null) => {
    let qs = {};
    if(items) {
      qs = {
        items: items.join(',')
      }
    }
    let result;

    try {
      result = API.get('assets', `/assets/list/${encodeURIComponent(fileType)}`, {
        queryStringParameters: qs
      });
    } catch (e) {
      console.log(e);
    }
    return result;
  },

  updateAsset: (fileName, asset) => {
    return API.put("assets", `/assets/${encodeURIComponent(fileName)}`, {
      body: asset
    });
  },

  resizeImage: (fileName, dimensions) => {
    return API.put("assets", `/assets/resize/${encodeURIComponent(fileName)}`,{
      body: { dimensions }
    })
  },

  listWikiLinks: (resolve,reject) =>
    API.get('assets', `/wiki`, {})
      .then(payload => resolve(payload))
      .catch(error => reject(error)),

  createWikiLinks: links => {
    return API.post('assets', '/wiki', {
      body: { items: links }
    })
  },

  bulkSaveWikiLinks: async function(links, logger = ({message}) => console.log) {
    const chunkSize = 20;
    let chunks = this.chunkArray(links, chunkSize);
    let unsaved = [];
    let saved = 0;

    for(let i=0; i<chunks.length; i++) {
      let params = chunks[i];

      try {
        await this.createWikiLinks(params);
        saved += chunks[i].length;

        logger({
          message: `saved ${chunkSize * (i+1)} from ${links.length} links`
        })
      } catch (e) {
        console.log('can not save links', e);
        logger({
          message: `error while saving ${i}th set of links`
        });
        unsaved = [ ...unsaved, ...chunks[i] ];
      }
    }

    return {
      unsaved,
      saved
    };
  }
}
