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
exports.deleted = exports.put = exports.post = exports.get = exports.isLogin = exports.setUser = exports.setCookie = exports.getUser = exports.getCookies = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const needle_1 = __importDefault(require("needle"));
const urlBase = 'https://www.tvtime.com';
let credFile = path_1.default.join(__dirname, 'access.json');
let exist = fs_1.default.existsSync(credFile)
    ? null
    : fs_1.default.writeFileSync(credFile, JSON.stringify({
        symfony: '',
        tvstRemember: '',
        user: 0
    }), 'utf8');
function getCookies() {
    const setting = require(credFile);
    let cookies;
    if (setting.tvstRemember.length > 0) {
        cookies = {
            tvstRemember: setting.tvstRemember,
            symfony: setting.symfony
        };
    }
    else
        cookies = {};
    return cookies;
}
exports.getCookies = getCookies;
function getUser() {
    const setting = require(credFile);
    let userId;
    if (setting.user > 0) {
        userId = setting.user;
    }
    else
        userId = 0;
    return userId;
}
exports.getUser = getUser;
function setCookie(callback, obj, remove = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let setting = require(credFile);
        setting = Object.assign(setting, obj);
        yield fs_1.default.open(credFile, 'w', (err, d) => {
            if (err)
                console.error(err);
            fs_1.default.write(d, JSON.stringify(setting, null, '\t'), 0, 'utf-8', (err) => {
                if (err)
                    return err;
                const txt = remove ? 'Deleting credentials' : 'Storing credentials';
                callback(txt);
            });
        });
    });
}
exports.setCookie = setCookie;
function setUser(callback, userId = 0) {
    setCookie(callback, { user: userId });
}
exports.setUser = setUser;
function removeAccess() {
    return new Promise((resolve, reject) => {
        setCookie((r) => {
            resolve(r);
        }, { tvstRemember: '', symfony: '', user: 0 }, true);
    });
}
function isLogin() {
    if (getCookies().tvstRemember !== undefined) {
        return true;
    }
    return false;
}
exports.isLogin = isLogin;
function get(urlPath, data) {
    const url = urlBase + urlPath;
    const cookies = { cookies: getCookies() };
    return new Promise((resolve, reject) => {
        (0, needle_1.default)('get', url, data, cookies)
            .then((resp) => {
            if (resp.cookies && resp.cookies.tvstRemember === 'deleted') {
                return removeAccess().then(resolve);
            }
            resolve(resp);
        })
            .catch(reject);
    });
}
exports.get = get;
function post(urlPath, data) {
    const url = urlBase + urlPath;
    const cookies = { cookies: getCookies() };
    return new Promise((resolve, reject) => {
        (0, needle_1.default)('post', url, data, cookies)
            .then((resp) => {
            const cookies = resp.cookies;
            if (cookies === null || cookies === void 0 ? void 0 : cookies.tvstRemember) {
                setCookie((d) => {
                    resolve(d);
                }, { tvstRemember: cookies.tvstRemember, symfony: cookies.symfony });
            }
            else {
                resolve('');
            }
        })
            .catch(reject);
    });
}
exports.post = post;
function put(urlPath, data) {
    const url = urlBase + urlPath;
    const cookies = { cookies: getCookies() };
    return new Promise((resolve, reject) => {
        (0, needle_1.default)('put', url, data, cookies)
            .then((resp) => {
            if (resp.cookies && resp.cookies.tvstRemember === 'deleted') {
                return removeAccess().then(resolve).catch(reject);
            }
            resolve(resp);
        })
            .catch(reject);
    });
}
exports.put = put;
function deleted(urlPath, data) {
    const url = urlBase + urlPath;
    const cookies = { cookies: getCookies() };
    return new Promise((resolve, reject) => {
        (0, needle_1.default)('delete', url, data, cookies)
            .then((resp) => {
            if (resp.cookies && resp.cookies.tvstRemember === 'deleted') {
                return removeAccess().then(resolve).catch(reject);
            }
            resolve(resp);
        })
            .catch(reject);
    });
}
exports.deleted = deleted;
