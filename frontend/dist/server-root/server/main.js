"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const config = require("./config");
const pages_router_1 = require("./routes/pages-router");
const statics_router_1 = require("./routes/statics-router");
const app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use(statics_router_1.staticsRouter());
app.use(pages_router_1.pagesRouter());
app.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
});
//# sourceMappingURL=main.js.map