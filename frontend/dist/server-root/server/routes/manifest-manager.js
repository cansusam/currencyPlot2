"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = require("../config");
const fs = require("fs");
const path = require("path");
function getManifestFromWebpack() {
    return new Promise((resolve, reject) => {
        const request = require('request');
        request.get(`http://localhost:${config_1.WEBPACK_PORT}/statics/manifest.json`, {}, (err, data) => err ? reject(err) : resolve(data.body));
    });
}
function getManifest() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let manifestStr;
        if (config_1.IS_DEV) {
            // load from webpack dev server
            manifestStr = yield getManifestFromWebpack();
        }
        else {
            // read from file system
            manifestStr = fs.readFileSync(path.join(process.cwd(), 'dist', 'statics', 'manifest.json'), 'utf-8').toString();
        }
        const manifest = JSON.parse(manifestStr);
        return manifest;
    });
}
exports.getManifest = getManifest;
//# sourceMappingURL=manifest-manager.js.map