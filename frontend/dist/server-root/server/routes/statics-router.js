"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const express_1 = require("express");
const config_1 = require("../config");
function staticsRouter() {
    const router = express_1.Router();
    if (config_1.IS_DEV) {
        const proxy = require('http-proxy-middleware');
        // All the assets are hosted by Webpack on localhost:${config.WEBPACK_PORT} (Webpack-dev-server)
        router.use('/statics', proxy({
            target: `http://localhost:${config_1.WEBPACK_PORT}/`,
        }));
    }
    else {
        const staticsPath = path.join(process.cwd(), 'dist', 'statics');
        // All the assets are in "statics" folder (Done by Webpack during the build phase)
        router.use('/statics', express.static(staticsPath));
    }
    return router;
}
exports.staticsRouter = staticsRouter;
//# sourceMappingURL=statics-router.js.map