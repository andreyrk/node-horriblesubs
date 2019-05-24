const HorribleSubsAPI = require('../src/index.js')

HorribleSubsAPI.getCurrentSeason().then((array) => {
    console.log(array);
});
