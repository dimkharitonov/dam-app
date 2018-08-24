import { slugify as sg } from 'transliteration';
import { Storage } from 'aws-amplify';

export default {
  getSlug: (fileName) => sg(fileName, { unknown: '_' }),

  getDocumentFileName: (fileName) => 'documents/' + fileName,

  getMediaFileName: (fileName) => 'media/' + fileName,

  unfoldEvent: event => {
    return {
      [event.target.id]: event.target.value
    };
  },

  storeData: async (body, meta, rewrite = true) => {

    const buildFileName = (name, extension) => name + extension;

    console.log(`Trying to save ${buildFileName(meta.fileName, meta.extension)}`);

    if(!rewrite) {
      console.log('no rewrite mode, check for existence');

      try {

        await Storage.get(buildFileName(meta.fileName, meta.extension), {download: true});
        await Storage.get(buildFileName(meta.fileName, '.meta'), {download: true});

        console.log(`file ${meta.fileName} already exists, skip it`);

        return new Promise(function(resolve, reject) {
          resolve({key: buildFileName(meta.fileName, '.meta')});
        });

      } catch (e) {
        console.log(`file ${meta.fileName} doesn't exists, save it`);
      }
    }

    return new Promise(function(resolve, reject) {

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
