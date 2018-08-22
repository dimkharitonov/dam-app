import wiki from 'wikijs';
import utils from "./Utils";

export default {
  getLanguage: (url) => {
    const topLevelParts = url.split('/');
    const domainParts = topLevelParts.length >=3 ? topLevelParts[2].split('.') : [];

    return domainParts.length >=3 ? domainParts[0] : 'en';
  },

  getPageName: (url) => url.split('/').reverse()[0],

  getApiUrl: (lang) => 'http://[LNG].wikipedia.org/w/api.php'.replace('[LNG]', lang),

  fetchPage: async (api, page, fields) => {

    let wikiData = {};

    try {
      wikiData = fields.map(async f => wiki({apiUrl:api}).page(page).then(page => page[f]()));

      wikiData = await Promise.all(wikiData);

      wikiData = fields.reduce((h, f, i) => {
        h[f] = wikiData[i];
        return h;
      }, {})

    } catch(e) {
      console.log(e);
      wikiData = {
        error: e,
        message: e.message
      }
    }

    return wikiData;
  },

  getFieldsAsHash: (fields, src) => fields.reduce((h, f)=>{
    h[f] = src[f];
    return h;
  }, {}),

  getArticle: async function(wikiPage, fields) {
    let result = {};
    console.log(this);
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
        coordinates: JSON.stringify(data.coordinates)
      };
    }
    return result;
  },

  getImageTitle: title => title.replace(/^File:/,'').replace(/\.\w+^/, ''),

  getImageId: desc => desc.split('=').reverse()[0],

  getImageExtension: src => '.' + src.split('.').reverse()[0],

  getImage: async (src) => {
    try {
      let data = await fetch(src);
      return data.blob();
    } catch (e) {
      console.log(e);
    }
  }

};