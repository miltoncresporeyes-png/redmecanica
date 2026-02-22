"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_123';
var REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_123';
var generateTokens = function (userId) {
    var accessToken = jsonwebtoken_1.default.sign({ userId: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    var refreshToken = jsonwebtoken_1.default.sign({ userId: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken: accessToken, refreshToken: refreshToken };
};
exports.generateTokens = generateTokens;
var verifyAccessToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
var verifyRefreshToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
