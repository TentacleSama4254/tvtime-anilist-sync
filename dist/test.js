"use strict";
const tvtime = require('tvtime-api');
require('dotenv').config();
//tvtime.login(process.env.TVuser, process.env.TVpass)
tvtime.login("inusha16@gmail.com", "tvtimerox4me", true).then((s) => {
    tvtime.shows('400090').then((data) => {
        console.info(JSON.stringify(data, undefined, 2));
        tvtime.show(data[2].id).then((data) => {
            console.info(JSON.stringify(data, undefined, 2));
            console.log(typeof (data.id));
        });
    });
    //tvtime.logout()
});
