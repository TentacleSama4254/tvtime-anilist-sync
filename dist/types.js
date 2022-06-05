"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaListStatus = exports.AniListMediaStatus = exports.AniListMediaType = void 0;
var AniListMediaType;
(function (AniListMediaType) {
    AniListMediaType["MANGA"] = "MANGA";
    AniListMediaType["ANIME"] = "ANIME";
})(AniListMediaType = exports.AniListMediaType || (exports.AniListMediaType = {}));
var AniListMediaStatus;
(function (AniListMediaStatus) {
    AniListMediaStatus["FINISHED"] = "FINISHED";
    AniListMediaStatus["RELEASING"] = "RELEASING";
    AniListMediaStatus["NOT_YET_RELEASED"] = "NOT_YET_RELEASED";
    AniListMediaStatus["CANCELLED"] = "CANCELLED";
})(AniListMediaStatus = exports.AniListMediaStatus || (exports.AniListMediaStatus = {}));
var MediaListStatus;
(function (MediaListStatus) {
    MediaListStatus["CURRENT"] = "CURRENT";
    MediaListStatus["PLANNING"] = "PLANNING";
    MediaListStatus["COMPLETED"] = "COMPLETED";
    MediaListStatus["DROPPED"] = "DROPPED";
    MediaListStatus["PAUSED"] = "PAUSED";
    MediaListStatus["REPEATING"] = "REPEATING";
})(MediaListStatus = exports.MediaListStatus || (exports.MediaListStatus = {}));
