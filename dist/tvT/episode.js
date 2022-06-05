"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.episodeEmotions = exports.episodeWatch = exports.episode = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const util = __importStar(require("./utils"));
/**
 * Return info about episode
 */
function episode(serieId, episodeId) {
    let infoEpisode;
    return new Promise((resolve, reject) => {
        util.get(`/en/show/${serieId}/episode/${episodeId}`)
            .then((resp) => {
            if (resp.statusCode === 200) {
                const page = cheerio_1.default.load(resp.body);
                const watched = page('a.watched-btn');
                const episodeWatched = watched.hasClass('watched');
                const info = page('div.episode-infos');
                const name = info.children().find('span[itemprop="name"]').text();
                const overview = info.children().find('div.overview span.long').text().trim();
                const published = info.children().find('time[itemprop="datePublished"]').text();
                infoEpisode = {
                    showId: serieId,
                    episodeId: episodeId,
                    name: name,
                    overview: overview,
                    published: published,
                    watched: episodeWatched
                };
                resolve(infoEpisode);
                return;
            }
            reject(new Error('Page not found'));
        })
            .catch(reject);
    });
}
exports.episode = episode;
/**
 * Mark episode watch
= */
function episodeWatch(episodeId) {
    return new Promise((resolve, reject) => {
        if (!util.isLogin) {
            resolve('User not login');
            return;
        }
        util.put('/watched_episodes', { episode_id: episodeId })
            .then((resp) => {
            if (typeof resp === 'string') {
                resolve(resp);
            }
            else {
                if (resp.statusCode === 200) {
                    resolve('Ok');
                }
                else {
                    reject(resp.statusMessage);
                }
            }
        })
            .catch(reject);
    });
}
exports.episodeWatch = episodeWatch;
/**
 *😀 Good = 1  |
 *😄 Fun = 2  |
 *😲 Wow = 3  |
 *😢 Sad = 4  |
 *🙄 So-so = 6  |
 *😶 Bad = 7
 */
function episodeEmotions(episodeId, emotionId = 1) {
    return new Promise((resolve, reject) => {
        if (!util.isLogin) {
            resolve('User not login');
            return;
        }
        util.post('/emotions', { episode_id: episodeId, emotion_id: emotionId })
            .then((resp) => {
            console.info(resp);
            if (typeof resp === 'string') {
                resolve(resp);
            }
            else {
                if (resp.statusCode === 200) {
                    resolve('Ok');
                }
                else {
                    reject(resp.statusMessage);
                }
            }
        })
            .catch(reject);
    });
}
exports.episodeEmotions = episodeEmotions;
