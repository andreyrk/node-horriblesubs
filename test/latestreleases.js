const HorribleSubsAPI = require('../src/index.js');

HorribleSubsAPI.getLatestReleases().then((array) => {
    console.log(array);
});
