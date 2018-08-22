import { slugify as sg } from 'transliteration';
import { Storage } from 'aws-amplify';

export default {
  getSlug: (fileName) => sg(fileName, { unknown: '_' }),


  unfoldEvent: event => {
    return {
      [event.target.id]: event.target.value
    };
  },

  storeData: (body, meta) => {

    const buildFileName = (name, extension) => name + extension;

    return new Promise(function(resolve, reject) {

      console.log('store document');
      Storage.put(
        buildFileName(meta.fileName, meta.extension),
        body,
        {
          contentType: meta.type
        })

        .then(result => {
          console.log('done', meta);
          console.log('store meta');
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
          console.log('all done', result);
          resolve(result);
        })

        .catch(e => {
          console.log(`Error storing ${meta.fileName} file type ${meta.type}. Origin ${meta.origin}`, e);
          reject(e);
        });

    });
  }
}
