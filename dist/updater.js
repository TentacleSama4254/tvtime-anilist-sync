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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tvTime = __importStar(require("./tvT/index"));
const aList = __importStar(require("./anilis/func"));
const quick_db_1 = require("quick.db");
const db = new quick_db_1.QuickDB({ filePath: "./data.sqlite" });
const functions_1 = require("./functions");
const node_cron_1 = __importDefault(require("node-cron"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    require('dotenv').config();
    const myCred = process.env.bb;
    yield tvTime.login(process.env.TVuser, process.env.TVpass);
    tvTime.recent().then((res) => __awaiter(void 0, void 0, void 0, function* () {
        let records = yield db.get(`showsRecords`);
        console.log(records);
        for (let i = 0; i < res.length; i++) {
            let show = res[i];
            console.log(show.name);
            let showData = yield tvTime.show(show.id);
            let watchData = yield (0, functions_1.getWatched)(showData);
            console.log(watchData);
            watchData.forEach((season) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                let newWatched = season.watched;
                season['name'] = show.name + ' ' + season.season;
                if (records && ((_a = records[show.id + '_' + season.season.replace(' ', '')]) === null || _a === void 0 ? void 0 : _a.watched) !== newWatched) {
                    (0, functions_1.syncShow)(show.id);
                }
                yield db.set(`showsRecords.${show.id + '_' + season.season.replace(' ', '')}`, season);
            }));
            //db.set(`shows.${show.id}`,show)
        }
    })).catch(console.log);
});
node_cron_1.default.schedule('*/10 * * * *', () => main());
require('dotenv').config();
const myCred = process.env.bb;
aList.createThread('img202(http://imgur.com/GTWlalL.png)', myCred).then(console.log).catch(console.log);
