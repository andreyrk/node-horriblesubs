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

  getTodaysAnime() {
    return axios.get(BASE_URL).then(response => {
      let $ = cheerio.load(response.data);
      return $(".schedule-widget-show").map((index, element) => {
        let el = $(element).find("a");

        return {
          title: el.text(),
          url: BASE_URL + el.attr("href")
        }
      }).get();
    }).catch(err => {throw err});
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

    return (async function loop() {
      while (true) {
        let url = BASE_URL + '/api.php?method=getshows&type=show&showid=' + id + '&nextid=' + page.toString();

        let array = await axios.get(url).then(async (response) => {
          if (response.data.trim().toLowerCase() === "done")
            response = await axios.get(BASE_URL + '/api.php?method=getshows&type=batch&showid=' + id + '&nextid=' + page.toString());

          let $ = cheerio.load(response.data);

          return $(".rls-info-container").map((index, element) => {
            let info_container = $(element).first();

            let resolutions = [];
            $(info_container).find(".rls-link").each((i, row) => {
              //let res = $(info_container).find(".link-" + row);
              let quality = $(row).find(".rls-link-label").text().trim().replace(":", "");
              let magnet = $(row).find(".hs-magnet-link").find("a");
              let torrent = $(row).find(".hs-torrent-link").find("a");
              let xdc = $(row).find(".hs-xdcc-link").find("a");

              resolutions.push({
                name: quality,
                magnet: magnet.attr("href"),
                torrent: torrent.attr("href"),
                xdc: xdc.attr("href"),
                downloads: $(row).find(".hs-ddl-link > a").map(function () {
                  return {
                    host: $(this).first().text(),
                    url: $(this).attr("href")
                  }
                }).get()
              });
            });

            let array = {
              number: info_container.attr("id"),
              releaseDate: info_container.find(".rls-date").text(),
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
