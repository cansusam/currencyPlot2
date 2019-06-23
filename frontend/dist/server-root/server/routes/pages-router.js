"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const manifest_manager_1 = require("./manifest-manager");
function pagesRouter() {
    const router = express_1.Router();
    router.get(`/**`, (_, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const manifest = yield manifest_manager_1.getManifest();
        res.render('page.ejs', { manifest });
    }));
    return router;
}
exports.pagesRouter = pagesRouter;
//# sourceMappingURL=pages-router.js.map