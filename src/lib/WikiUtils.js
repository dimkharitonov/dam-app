import wiki from 'wikijs';
import utils from "./Utils";

export default {
  getLanguage: (url) => {
    if(!url) {
      console.log('Url is not defined', url);
      return 'en';
    }
    const topLevelParts = url.split('/');
    const domainParts = topLevelParts.length >=3 ? topLevelParts[2].split('.') : [];

    return domainParts.length >=3 ? domainParts[0] : 'en';
  },

  getPageName: (url) => decodeURI(url).split('/').reverse()[0],

  getApiUrl: (lang) => 'https://[LNG].wikipedia.org/w/api.php'.replace('[LNG]', lang),

  fetchPage: async (api, page, fields) => {

    let wikiData = {};

    for (let i=0; i<fields.length; i++) {
      const f = fields[i];
      try {
        wikiData[f] = await wiki({
            apiUrl:api,
            origin: '*'
          })
          .page(page).then(page => page[f]());
      } catch (e) {
        console.log(`Can't get field ${f}`, e.message);
        wikiData[f] ='';
      }
    }

    return wikiData;
  },

  getFieldsAsHash: (fields, src) => fields.reduce((h, f)=>{
    h[f] = src[f];
    return h;
  }, {}),

  getArticle: async function(wikiPage) {
    const fields = this.getFields();
    let result = {};
    const apiUrl = this.getApiUrl(this.getLanguage(wikiPage));
    const pageName = this.getPageName(wikiPage);

    const data = await this.fetchPage(apiUrl, pageName, fields);

    if(!data.error) {
      // update state
      let title = (data.fullInfo && data.fullInfo.name) || pageName.replace('_', ' ');

      result = {
        ...this.getFieldsAsHash(fields, data),
        title: title,
        slug: this.getLanguage(wikiPage) + '_' + utils.getSlug(title),
        origin: wikiPage,
        coordinates: data.coordinates ? JSON.stringify(data.coordinates) : ''
      };
    }
    return result;
  },

  saveArticle: async function(data, progressFunc = f => f, extraCategories=[]) {
    const fields = this.getFields();

    let meta = {
      title: data.title || 'noname' + Date.now(),
      origin: data.origin || null,
      summary: data.summary || null,
      categories: [
        ...(data.categories || []),
        ...extraCategories
      ],
      langlinks: data.langlinks || [],
      coordinates: data.coordinates || null,
      fileName: utils.getDocumentFileName(data.slug),
      extension: '.json',
      type: 'application/json',
      created: Date.now()
    };

    let document = {
      ...this.getFieldsAsHash(fields, data),
      title: data.title
    };

    let relatedImages = [];

    try {
      // save images
      if(document.rawImages && document.rawImages.length > 0) {

        for(let i=0; i<document.rawImages.length; i++) {
          let imageMeta = {};

          try {
            const image = document.rawImages[i];

            progressFunc({ message: `image ${i+1} of ${document.rawImages.length}: fetching...`});
            let imageFile = await this.getImage(image.imageinfo[0].url);

            imageMeta = {
              title: this.getImageTitle(image.title),
              fileName: utils.getMediaFileName(image.pageid || this.getImageId(image.imageinfo[0].descriptionshorturl)),
              extension: this.getImageExtension(image.imageinfo[0].url),
              origin: image.imageinfo[0].descriptionurl,
              source: image.imageinfo[0].url,
              type: imageFile.type,
              created: Date.now()
            };

            progressFunc({ message: `image ${i+1} of ${document.rawImages.length}: uploading...`});

            let result = await utils.storeData(imageFile, imageMeta, false);
            relatedImages = [
              ...relatedImages,
              result.key
            ];

            // clear data
            imageFile = null;

            // create thumbnails
            if(!result.exist && ['.jpg','.jpeg','.png'].reduce(
              (acc, val) => acc || val === imageMeta.extension.toLowerCase(),
              false
            )) {
              await utils.resizeImage([imageMeta.fileName, imageMeta.extension].join(''), [240, 640]);
            } else {
              console.log('THUMBNAILS: file exist or wrong extension', result.exist, imageMeta.extension);
            }
          } catch (e) {
            progressFunc({ message: `ERROR while saving image ${imageMeta}`});
          }
        }
      }

      // save document

      progressFunc({ message: 'saving document'});

      meta = {
        ...meta,
        relatedImages: relatedImages
      };

      console.log('document to save', document);

      await utils.storeData(JSON.stringify(document), meta);

      console.log('stored successfull');

      return({
        success: true,
      });
    } catch (e) {
      console.log('get error ', e);
      return({
        success: false,
        error: e
      });
    }
  },

  getImageTitle: title => title.replace(/^File:/,'').replace(/\.\w+$/, ''),

  getImageId: desc => desc.split('=').reverse()[0],

  getImageExtension: src => '.' + src.split('.').reverse()[0],

  getImage: async (src) => {
    try {
      let data = await fetch(src);
      return data.blob();
    } catch (e) {
      console.log(e);
    }
  },

  getFields: () => [
    'content',
    'html',
    'categories',
    'fullInfo',
    'coordinates',
    'langlinks',
    'links',
    'backlinks',
    'mainImage',
    'rawImages',
    'summary'
  ],

  getCategoriesList: () => [
    'Category',
    'Type',
    'Location',
    'Category_ru',
    'Tag'
  ],

  splitCategory: (category) => category.split(',').map(c => c.trim()),

  addPrefix: (categoryName, categories) => categories.map(c => categoryName + ':' + c),

  getExtraCategories: function(item) {
    return this.getCategoriesList()
      .map(c =>
        item[c.toLowerCase()]
          ? this.addPrefix(c, this.splitCategory(item[c.toLowerCase()]))
          : []
      )
      .reduce((acc, val) => acc.concat(val), [])
  },


  importWikiArticle: async function(item, logger) {
    console.log('WU: import ', item);

    const data = await this.getArticle(item.articleID);

    return this.saveArticle(data, logger, this.getExtraCategories(item));
  }


};