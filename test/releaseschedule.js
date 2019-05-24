const HorribleSubsAPI = require('../src/index.js')

HorribleSubsAPI.getReleaseSchedule().then((array) => {
    array.forEach(item => {
        console.log(item.day);
        console.log(item.shows);
    });
});
