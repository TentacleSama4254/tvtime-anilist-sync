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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserData = exports.setMediaStatus = exports.createThread = exports.addMediaIdToList = exports.updateUserList = exports.fetchAnilistUserList = exports.fetchAnilistMedia = exports.queryAnilist = void 0;
const axios_1 = __importDefault(require("axios"));
const anilist_update_errors_1 = require("./anilist-update-errors");
/**
 * generic query function for Anilist API
 * throws CustomError if unable to complete
 */
function queryAnilist(query, variables, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestConfig = {
            method: 'post',
            url: 'https://graphql.anilist.co',
            data: {
                query: query,
                variables: variables
            },
            validateStatus: function (status) { return status < 500; } // no errors on 404
        };
        if (typeof accessToken === 'string') { // add to request
            Object.assign(requestConfig, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        }
        const response = yield (0, axios_1.default)(requestConfig);
        if (Array.isArray(response.data.errors)) { // something went wrong
            throw new anilist_update_errors_1.CustomError({
                message: `Error querying Anilist API: ${response.data.errors[0].message}`,
                data: response.data.errors
            });
        }
        return response.data;
    });
}
exports.queryAnilist = queryAnilist;
function fetchAnilistMedia(searchString) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        id
        title {
          english
          romaji
        }
        episodes
        seasonYear
        episodes
        relations {
          nodes {
            id
            type
            seasonYear
            episodes
        title {
          english
          romaji
        }
          }
        }
        coverImage {
          extraLarge
        }
      }
    }
  `;
        const variables = { search: searchString };
        // no try; let errors bubble
        const result = yield queryAnilist(query, variables, null);
        const mediaTitle = (_a = result.data.Media.title.english) !== null && _a !== void 0 ? _a : result.data.Media.title.romaji;
        //console.log(JSON.stringify(result.data,undefined,2))
        return result.data;
    });
}
exports.fetchAnilistMedia = fetchAnilistMedia;
function fetchAnilistUserList(mediaId, userName) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    query ($mediaId: Int, $userName: String) {
      MediaList (mediaId: $mediaId, userName: $userName) {
        id
        mediaId
        progress
        score
        status
      }
    }
  `;
        const variables = { mediaId: mediaId, userName: userName };
        // no try; let errors bubble
        const result = yield queryAnilist(query, variables, null);
        if (result.data.MediaList === null) {
            throw new anilist_update_errors_1.CustomError({
                message: 'fetchAnilistUserList() was successful but returned a null user list',
                data: result.data
            });
        }
        return {
            listId: result.data.MediaList.id,
            mediaId: result.data.MediaList.mediaId,
            progress: result.data.MediaList.progress,
            score: result.data.MediaList.score,
            status: result.data.MediaList.status
        };
    });
}
exports.fetchAnilistUserList = fetchAnilistUserList;
function updateUserList(mediaId, progress, score, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    mutation ($mediaId: Int, $progress: Int, $scoreRaw: Int) {
        SaveMediaListEntry (mediaId: $mediaId, progress: $progress, scoreRaw: $scoreRaw) {
            id
            progress
            score
        }
    }
  `;
        const variables = { mediaId: mediaId, progress: progress, scoreRaw: score };
        // no try; let errors bubble
        const result = yield queryAnilist(query, variables, accessToken);
        return result;
    });
}
exports.updateUserList = updateUserList;
function addMediaIdToList(mediaId, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isNaN(mediaId) || !accessToken) {
            throw new Error(`ERROR: invalid value for mediaId (${mediaId}), or accessToken (${accessToken})`);
        }
        const query = `
    mutation ($mediaId: Int) {
        SaveMediaListEntry (mediaId: $mediaId) {
            id
            mediaId
            progress
            score
            status
        }
    }
  `;
        const variables = { mediaId: mediaId };
        const result = yield queryAnilist(query, variables, accessToken);
        return {
            listId: result.data.SaveMediaListEntry.id,
            mediaId: result.data.SaveMediaListEntry.mediaId,
            progress: result.data.SaveMediaListEntry.progress,
            score: result.data.SaveMediaListEntry.score,
            status: result.data.SaveMediaListEntry.status
        };
    });
}
exports.addMediaIdToList = addMediaIdToList;
function createThread(text, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!accessToken) {
            throw new Error(`ERROR: invalid valu, or accessToken (${accessToken})`);
        }
        const query = `
    mutation ($text: String) {  
      SaveTextActivity (text: $text) {
            id
            type
            text
        }
    }
  `;
        const variables = { text: text };
        const result = yield queryAnilist(query, variables, accessToken);
        return result.data;
    });
}
exports.createThread = createThread;
function setMediaStatus(mediaId, accessToken, status) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isNaN(mediaId) || !accessToken) {
            throw new Error(`ERROR: invalid value for mediaId (${mediaId}), or accessToken (${accessToken})`);
        }
        const query = `
    mutation ($mediaId: Int, $status: MediaListStatus) {
        SaveMediaListEntry (mediaId: $mediaId, status: $status) {
            id
            mediaId
            progress
            score
            status
        }
    }
  `;
        const variables = { mediaId: mediaId, status: status };
        const result = yield queryAnilist(query, variables, accessToken);
        return {
            listId: result.data.SaveMediaListEntry.id,
            mediaId: result.data.SaveMediaListEntry.mediaId,
            progress: result.data.SaveMediaListEntry.progress,
            score: result.data.SaveMediaListEntry.score,
            status: result.data.SaveMediaListEntry.status
        };
    });
}
exports.setMediaStatus = setMediaStatus;
function fetchUserData(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
    query {
      Viewer {
        id
        name
        siteUrl
      }
    }
  `;
        // no try; let errors bubble
        const result = yield queryAnilist(query, {}, accessToken);
        return {
            id: result.data.Viewer.id,
            name: result.data.Viewer.name,
            siteUrl: result.data.Viewer.siteUrl
        };
    });
}
exports.fetchUserData = fetchUserData;
