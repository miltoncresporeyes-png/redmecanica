"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var zod_1 = require("zod");
var httpErrors_js_1 = require("../lib/httpErrors.js");
var validate = function (schema, source) {
    if (source === void 0) { source = 'body'; }
    return function (req, _res, next) {
        try {
            var data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
            var parsed = schema.parse(data);
            // Replace original data with parsed/validated data (helpful for coercion)
            if (source === 'body')
                req.body = parsed;
            if (source === 'query')
                req.query = parsed;
            if (source === 'params')
                req.params = parsed;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                var message = error.issues.map(function (e) { return "".concat(e.path.join('.'), ": ").concat(e.message); }).join(', ');
                next(new httpErrors_js_1.BadRequestError(message));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
