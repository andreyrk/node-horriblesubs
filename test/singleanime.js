const HorribleSubsAPI = require('../src/index.js');

HorribleSubsAPI.getAnimeData("https://horriblesubs.info/shows/sewayaki-kitsune-no-senko-san/").then((anime) => {
    console.log(anime);

    HorribleSubsAPI.getAnimeEpisodes(anime.id).then((episodes) => {
        console.log(episodes[0]);
    });
});

