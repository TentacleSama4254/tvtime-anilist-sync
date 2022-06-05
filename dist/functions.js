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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.syncShow = exports.matchSeasons = exports.getWatched = void 0;
const aList = __importStar(require("./anilis/func"));
const quick_db_1 = require("quick.db");
const db = new quick_db_1.QuickDB({ filePath: "./data.sqlite" });
const q = require('../my_modules/quick.db');
const db2 = q('./local.sqlite');
const tvTime = __importStar(require("./tvT/index"));
function getWatched(tvRes) {
    return __awaiter(this, void 0, void 0, function* () {
        let season = [];
        tvRes.seasons.forEach(s => {
            let epiT = s.episodes.length;
            let epiW = s.episodes.filter(e => e.watched).length;
            let sesN = s.name;
            let stat = epiW == 0 ? 'PLANNING' : epiW == epiT ? 'COMPLETED' : 'IN_PROGRESS';
            let year = s.episodes[0].airDate.split('-')[0];
            season.push({ season: sesN, episodes: epiT, watched: epiW, status: stat, year: year });
        });
        return season;
    });
}
exports.getWatched = getWatched;
let matchSeasons = (data, data2) => __awaiter(void 0, void 0, void 0, function* () {
    let final = [];
    data.forEach(d => {
        let obj = {};
        let found = data2.find(d2 => d2.seasonYear.toString() == d.year);
        console.log(found);
        // data2.forEach(d2=>{
        //     console.log(d2.seasonYear.toString())
        //     console.log(d.year)
        // })
        obj['tvT'] = d;
        obj['anilist'] = found;
        if (found)
            final.push(obj);
    });
    console.log(JSON.stringify(final, undefined, 2));
    return final;
});
exports.matchSeasons = matchSeasons;
const syncShow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    require('dotenv').config();
    const myCred = process.env.bb;
    let show = yield tvTime.show(id);
    //console.log(JSON.stringify(show,undefined,2))
    let watched = yield getWatched(show);
    //console.log(watched)
    console.log(show.name);
    let aniS = yield aList.fetchAnilistMedia(show.name);
    //    console.log(JSON.stringify(aniS,undefined,2))
    let aniArr = aniS.Media.relations.nodes.filter((n) => n.type == 'ANIME');
    if (watched[0].status == 'COMPLETED') {
        yield aList.setMediaStatus(aniS.Media.id, myCred, 'COMPLETED').then(console.log);
    }
    else if (watched[0].status == 'PLANNING') {
        yield aList.setMediaStatus(aniS.Media.id, myCred, 'PLANNING').then(console.log);
    }
    else {
        yield aList.updateUserList(aniS.Media.id, watched[0].watched, 7, myCred).then(console.log);
        yield aList.setMediaStatus(aniS.Media.id, myCred, 'PAUSED').then(console.log);
    }
    if (watched.length > 1) {
        let matched = yield (0, exports.matchSeasons)(watched, aniArr);
        matched.forEach((m) => __awaiter(void 0, void 0, void 0, function* () {
            if (watched[0].status == 'COMPLETED') {
                yield aList.setMediaStatus(m.anilist.id, myCred, 'COMPLETED').then(console.log);
            }
            else if (watched[0].status == 'PLANNING') {
                yield aList.setMediaStatus(m.anilist.id, myCred, 'PLANNING').then(console.log);
            }
            else {
                yield aList.updateUserList(m.anilist.id, m.tvT.watched, 7, myCred).then(console.log);
                yield aList.setMediaStatus(m.anilist.id, myCred, 'PAUSED').then(console.log);
            }
        }));
    }
});
exports.syncShow = syncShow;
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((sendMessage) => setTimeout(sendMessage, ms));
    });
}
exports.sleep = sleep;
