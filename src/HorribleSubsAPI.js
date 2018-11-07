const cheerio = require('cheerio');
const axios = require('../util/axios.js');

const BASE_URL = 'https://horriblesubs.info';
const BASE_URL_SHOWS = BASE_URL + '/shows/';

class HorribleSubsAPI {
  constructor() {

  }

  getAllAnime() {
    return axios.get(BASE_URL_SHOWS).then((response) => {
      let $ = cheerio.load(response.data);

      return $(".ind-show").map((index, element) => {
        let el = $(element).find("a");

        return {
          title: el.attr("title"),
          url: BASE_URL + el.attr("href")
        }
      }).get();
    }).catch((error) => {
      throw error;
    });
  }

  getAnimeData(url) {
    return axios.get(url).then((response) => {
      let $ = cheerio.load(response.data);

      let result = {};

      // Title
      result.title = $(".entry-title").text();

      // URL
      result.url = url;

      // Image
      result.picture = BASE_URL + $(".series-image").first().find("img").first().attr("src");

      // Description
      result.description = "";

      $(".series-desc").first().children().each((index, element) => {
        if (index !== 0) {
          result.description = result.description.concat($(element).text());
        }
      });

      // Show ID
      let str = 'var hs_showid = ';
      let html = $(".entry-content").first().find("script").first().html();
      result.id = html.substring(str.length, html.length - 1);

      return result;
    }).catch((error) => {
      throw error;
    });
  }

  async getAnimeEpisodes(id) {
    let page = 0;
    let episodes = [];
    let qualities = ['480p', '720p', '1080p'];

    return (async function loop() {
      while (true) {
        let url = BASE_URL + '/api.php?method=getshows&type=show&showid=' + id + '&nextid=' + page.toString();

        let array = await axios.get(url).then((response) => {
          let $ = cheerio.load(response.data);

          return $(".rls-info-container").map((index, element) => {
            let info_container = $(element).first();

            let resolutions = [];
            qualities.forEach((quality, index) => {
              let res = $(".link-" + quality);
              let magnet = res.find(".hs-magnet-link").find("a");

              resolutions[index] = {
                name: quality,
                magnet: magnet.attr("href")
              };
            });

            let array = {
              number: info_container.attr("id"),
              resolutions: resolutions
            };

            return array;
          }).get();
        });

        episodes = episodes.concat(array);

        if (array.length === 0) {
          break;
        }

        page++;
      }

      return episodes;
    })();
  }
}

module.exports = new HorribleSubsAPI();
