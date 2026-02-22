"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var cookie_parser_1 = require("cookie-parser");
// import helmet from "helmet";
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3010;
// Prisma client moved to db.ts
// export const prisma = new PrismaClient();
// app.use(helmet());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
// Basic health check
app.get("/", function (_req, res) {
    res.send("RedMecanica Backend Running");
});
var jobs_js_1 = require("./routes/jobs.js");
var services_js_1 = require("./routes/services.js");
var users_js_1 = require("./routes/users.js");
var providers_js_1 = require("./routes/providers.js");
var admin_js_1 = require("./routes/admin.js");
var quotes_js_1 = require("./routes/quotes.js");
var payments_js_1 = require("./routes/payments.js");
var auth_js_1 = require("./routes/auth.js");
app.use('/api/jobs', jobs_js_1.default);
app.use('/api/services', services_js_1.default);
app.use('/api/users', users_js_1.default);
app.use('/api/providers', providers_js_1.default);
app.use('/api/admin', admin_js_1.default);
app.use('/api/quotes', quotes_js_1.default);
app.use('/api/payments', payments_js_1.default);
app.use('/api/auth', auth_js_1.default);
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
