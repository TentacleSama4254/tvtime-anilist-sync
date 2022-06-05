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
const tvTime = __importStar(require("./tvT/index"));
const quick_db_1 = require("quick.db");
const functions_1 = require("./functions");
const cache = new quick_db_1.QuickDB({ filePath: "./data.sqlite" });
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    require('dotenv').config();
    const myCred = process.env.bb;
    let complete = yield cache.get('synced');
    yield tvTime.login(process.env.TVuser, process.env.TVpass);
    const allShows = yield tvTime.shows();
    for (let i = 0; i < allShows.length; i++) {
        const show = allShows[i];
        try {
            if (!(complete === null || complete === void 0 ? void 0 : complete.includes(show.id)))
                yield (0, functions_1.syncShow)(show.id);
            yield cache.push('synced', show.id);
        }
        catch (e) {
            //console.log(e)
            console.log('Normie');
            yield cache.push('failed', show.id);
        }
        yield (0, functions_1.sleep)(500);
    }
});
main();
process.on('uncaughtExeption', (exp) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('uncaught exeption  ' + exp);
}));
process.on('unhandledRejection', (err) => {
    console.log(err);
});
