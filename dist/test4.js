"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var request = require('request');
var options = {
    uri: 'https://anilist.co/api/v2/oauth/authorize?client_id=7600&redirect_uri=https://anilist.co/api/v2/oauth/pin&response_type=code',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    json: {
        'grant_type': 'authorization_code',
        'client_id': '7600',
        'client_secret': 'fazoyYe6YNJ3DmVrwXVZBGrAIMjbRVK3ieSlmcVn',
        'redirect_uri': 'https://anilist.co/api/v2/oauth/pin',
        'code': 'null'
    }
};
let r = request('https://anilist.co/api/v2/oauth/authorize?client_id=7600&response_type=code', function (error, response, body) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (response.statusCode == 200) {
        //   console.log(JSON.stringify(body).split('Redirecting'));
        // }
        // else console.log(body)
        yield r;
        console.log(r.uri);
        console.log(response.request.uri);
        //else console.log(error,JSON.stringify(body).split('redirect_uri=https://anilist.co/api/v2/oauth/pin.&amp;code=')[1].split(';')[0])
    });
});
