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
exports.unfollowShow = exports.followShow = exports.show = exports.recent = exports.shows = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const util = __importStar(require("./utils"));
function shows() {
    const listShows = [];
    return new Promise((resolve, reject) => {
        if (!util.isLogin()) {
            reject('User no login');
            return;
        }
        const userId = util.getUser();
        util.get(`/en/user/${userId}/profile`)
            .then((resp) => {
            const bodyParse = cheerio_1.default.load(resp.body);
            bodyParse('ul.shows-list li.first-loaded').each((index, item) => {
                var _a;
                const li = cheerio_1.default.load(item);
                const linkSerie = li('div.poster-details a');
                const imgSerie = li('div.image-crop img');
                listShows.push({
                    id: (_a = linkSerie.attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[3],
                    name: linkSerie.text().trim(),
                    img: imgSerie.attr('src')
                });
            });
            resolve(listShows);
        })
            .catch(reject);
    });
}
exports.shows = shows;
function recent() {
    const listShows = [];
    return new Promise((resolve, reject) => {
        if (!util.isLogin()) {
            reject('User no login');
            return;
        }
        const userId = util.getUser();
        util.get(`/en/user/${userId}/profile`)
            .then((resp) => {
            const bodyParse = cheerio_1.default.load(resp.body);
            bodyParse('#recently-watched-shows li.first-loaded').each((index, item) => {
                var _a;
                const $ = cheerio_1.default.load(item);
                const linkSerie = $('div.poster-details a');
                const imgSerie = $('div.image-crop img');
                listShows.push({
                    id: (_a = linkSerie.attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[3],
                    name: linkSerie.text().trim(),
                    img: imgSerie.attr('src')
                });
            });
            resolve(listShows);
        })
            .catch(reject);
    });
}
exports.recent = recent;
function show(serieId) {
    let infoShows;
    return new Promise((resolve, reject) => {
        util.get(`/en/show/${serieId}`)
            .then((resp) => {
            if (resp.statusCode === 200) {
                const page = cheerio_1.default.load(resp.body);
                const header = page('div.container-fluid div.heading-info');
                const info = page('div.show-nav');
                const temporadas = [];
                page('div.seasons div.season-content').each((index, item) => {
                    const divSeason = cheerio_1.default.load(item);
                    const name = divSeason('span[itemprop="name"]').text();
                    const episodios = [];
                    divSeason('ul.episode-list li').each((index, li) => {
                        const episode = cheerio_1.default.load(li);
                        const linkEpisode = episode('div.infos div.row a:first');
                        const idEpisode = linkEpisode.attr('href').split('/');
                        const nameEpisode = episode('div.infos div.row a span.episode-name').text().trim();
                        const airEpisode = episode('div.infos div.row a span.episode-air-date').text().trim();
                        const watchedBtn = episode('a.watched-btn');
                        const episodeWatched = watchedBtn.hasClass('active');
                        episodios.push({
                            id: idEpisode[5],
                            name: nameEpisode,
                            airDate: airEpisode,
                            watched: episodeWatched
                        });
                    });
                    temporadas.push({
                        name: name,
                        episodes: episodios
                    });
                });
                infoShows = {
                    id: serieId,
                    name: header.children('h1').text().trim(),
                    overview: info.children().find('div.overview').text().trim(),
                    seasons: temporadas
                };
                resolve(infoShows);
                return;
            }
            reject(new Error('Page not found'));
        })
            .catch(reject);
    });
}
exports.show = show;
function followShow(serieId) {
    return new Promise((resolve, reject) => {
        util.put('/followed_shows', { show_id: serieId })
            .then((resp) => {
            if (resp.statusCode === 200) {
                resolve('Ok');
            }
            else {
                reject(resp.statusMessage);
            }
        })
            .catch(reject);
    });
}
exports.followShow = followShow;
function unfollowShow(serieId) {
    return new Promise((resolve, reject) => {
        util.deleted('/followed_shows', { show_id: serieId })
            .then((resp) => {
            if (resp.statusCode === 200) {
                resolve('Ok');
            }
            else {
                reject(resp.statusMessage);
            }
        })
            .catch(reject);
    });
}
exports.unfollowShow = unfollowShow;
