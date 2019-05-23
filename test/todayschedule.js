const HorribleSubsAPI = require('../src/index.js');

HorribleSubsAPI.getTodaysAnime().then((array) => {
    console.log(array);
});
