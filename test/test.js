const HorribleSubsAPI = require('../src/index.js')

HorribleSubsAPI.getAllAnime().then((array) => {
    console.log(array[0]);

    HorribleSubsAPI.getAnimeData(array[0].url).then((anime) => {
        console.log(anime);

        HorribleSubsAPI.getAnimeEpisodes(anime.id).then((episodes) => {
            console.log(episodes[0]);
        });
    });
});
