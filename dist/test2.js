"use strict";
//def5020064ce3f398f89b74ac70337352043a354f5c62cb8a4212f0e6131898363336c680fb01bd20437e849fc8a928b238eb229b9ed2576448cec8451cab078a8668d118bd4526e9dd8879203d503ea3dca8262cfc9d911679d8d173b8acd658777809bfb6e25ff9b80eb222326bf64f9f7ab
var request = require('request');
var options = {
    uri: 'https://anilist.co/api/v2/oauth/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    json: {
        'grant_type': 'authorization_code',
        'client_id': '7600',
        'client_secret': 'fazoyYe6YNJ3DmVrwXVZBGrAIMjbRVK3ieSlmcVn',
        'redirect_uri': 'https://anilist.co/api/v2/oauth/pin.',
        'code': 'def502009d11aa35ae7fc863da434cac70db22472ae1e26d1025901b74c8f3caa50c74af965a223738f0d9e00a818c642c68b22a0cb01bb66fcdec5c9ae8f3daecfd51d0e02eb00d28e007ebf4a9c0730925530a44e70f6ec057b9b7cd1e174cab0b46691beab7f52aa175e4788c95188819e1762bcb9a13a106db56a4ff248a41b56d8521da671fce800e85ad750f5facb23d4380eaeede7e3d18ca7bee6e550f19a91cd5d20be534adee5d794d7b6eb636c6c062eaca82fa3f7106122ad8c92d003e62c3f4a048fde73d9d3ec38c551d1fc7aaa4f250f0565a72d5d1c999ea68f00b773003690bf6d884eee972636732fbed2c3c07e05f676067bd2e269ce2e089e5fb797a517f145328de7f3d80c92598b6547c087e5ad3805b2cfc69ee5cac1b9649c6d106c2e776e43b4518b43a76f1c755e107207109cb2bc2228ae6cc14b0b234c61378b340bf51b0ba2c74cdb87dc9de8c34492a77ad2a0c5d65464ea87587f262fab8947d92936a4f19edbe1b73'
    }
};
request(options, function (error, response, body) {
    if (response.statusCode == 200) {
        console.log(body);
    }
    else
        console.log(error, body);
});
