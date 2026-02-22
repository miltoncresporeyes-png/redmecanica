"use strict";
/**
 * Webpay Service - Integración con Transbank Webpay Plus
 *
 * Este servicio maneja la integración con Webpay Plus de Transbank.
 * Para producción, necesitas:
 * 1. Cuenta comercial Webpay Plus en Transbank
 * 2. Credenciales (commerceCode y apiKey)
 *
 * Documentación: https://www.transbankdevelopers.cl/
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpayService = void 0;
var Environment = {
    Integration: 'https://webpay3gint.transbank.cl',
    Production: 'https://webpay3g.transbank.cl'
};
var WebpayService = /** @class */ (function () {
    function WebpayService() {
        this.isConfigured = false;
        this.commerceCode = process.env.WEBPAY_COMMERCE_CODE || '';
        this.apiKey = process.env.WEBPAY_API_KEY || '';
        if (this.commerceCode && this.apiKey) {
            this.isConfigured = true;
            this.environment = process.env.NODE_ENV === 'production'
                ? Environment.Production
                : Environment.Integration;
            console.log('✅ Webpay configurado en modo:', this.isConfigured ? (process.env.NODE_ENV === 'production' ? 'PRODUCCIÓN' : 'INTEGRACIÓN') : 'NO CONFIGURADO');
        }
        else {
            console.warn('⚠️ Webpay no configurado. Usando modo simulación.');
            this.environment = Environment.Integration;
            this.commerceCode = '597055555532';
            this.apiKey = '579B532A4D93CB346FF21B291E2A0FF17937CCAS';
        }
    }
    WebpayService.prototype.isWebpayConfigured = function () {
        return this.isConfigured;
    };
    WebpayService.prototype.getEnvironment = function () {
        return this.environment;
    };
    WebpayService.prototype.createTransaction = function (buyOrder, sessionId, amount, returnUrl, finalUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConfigured) {
                            return [2 /*return*/, this.simulateCreateTransaction(buyOrder, sessionId, amount)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.callWebpayApi('create', {
                                buyOrder: buyOrder,
                                sessionId: sessionId,
                                amount: amount,
                                returnUrl: returnUrl,
                                finalUrl: finalUrl
                            })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, {
                                token: response.token,
                                url: response.url,
                                buyOrder: buyOrder,
                                sessionId: sessionId,
                                amount: amount
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error creating Webpay transaction:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebpayService.prototype.commitTransaction = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConfigured) {
                            return [2 /*return*/, this.simulateCommitTransaction(token)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.callWebpayApi('commit', { token: token })];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, {
                                vci: response.vci,
                                amount: response.amount,
                                status: response.status,
                                buyOrder: response.buyOrder,
                                sessionId: response.sessionId,
                                cardDetail: response.cardDetail,
                                accountingDate: response.accountingDate,
                                transactionDate: response.transactionDate,
                                authorizationCode: response.authorizationCode,
                                paymentTypeCode: response.paymentTypeCode,
                                responseCode: response.responseCode
                            }];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error committing Webpay transaction:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebpayService.prototype.refundTransaction = function (token, amount, authorizationCode, buyOrder) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isConfigured) {
                            return [2 /*return*/, this.simulateRefundTransaction(token, amount)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.callWebpayApi('refund', {
                                token: token,
                                amount: amount,
                                authorizationCode: authorizationCode,
                                buyOrder: buyOrder
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error refunding Webpay transaction:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WebpayService.prototype.callWebpayApi = function (action, params) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, xmlRequest, response, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.environment + '/webpayserver/v3.cgi';
                        xmlRequest = this.buildSoapRequest(action, params);
                        return [4 /*yield*/, fetch(endpoint, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'text/xml; charset=utf-8',
                                    'Authorization': "Basic ".concat(Buffer.from(this.commerceCode + ':' + this.apiKey).toString('base64'))
                                },
                                body: xmlRequest
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        return [2 /*return*/, this.parseSoapResponse(action, text)];
                }
            });
        });
    };
    WebpayService.prototype.buildSoapRequest = function (action, params) {
        var timestamp = new Date().toISOString();
        switch (action) {
            case 'create':
                return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:wps=\"http://webservices.webpay.cl/\">\n  <soapenv:Header/>\n  <soapenv:Body>\n    <wps:initTransaction>\n      <wsTransaction>\n        <buyOrder>".concat(params.buyOrder, "</buyOrder>\n        <sessionId>").concat(params.sessionId, "</sessionId>\n        <amount>").concat(params.amount, "</amount>\n        <returnUrl>").concat(params.returnUrl, "</returnUrl>\n        <finalUrl>").concat(params.finalUrl, "</finalUrl>\n      </wsTransaction>\n      <wpmDetail>\n        <businessToken/>\n      </wpmDetail>\n    </wps:initTransaction>\n  </soapenv:Body>\n</soapenv:Envelope>");
            case 'commit':
                return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soapenv:Header/>\n  <soapenv:Body>\n    <ws:getTransactionResult>\n      <token>".concat(params.token, "</token>\n    </ws:getTransactionResult>\n  </soapenv:Body>\n</soapenv:Envelope>");
            case 'refund':
                return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">\n  <soapenv:Header/>\n  <soapenv:Body>\n    <ws>nullify>\n      <token>".concat(params.token, "</token>\n      <authorizationCode>").concat(params.authorizationCode, "</authorizationCode>\n      <authorizedAmount>").concat(params.amount, "</authorizedAmount>\n      <buyOrder>").concat(params.buyOrder, "</buyOrder>\n    </ws>nullify>\n  </soapenv:Body>\n</soapenv:Envelope>");
            default:
                return '';
        }
    };
    WebpayService.prototype.parseSoapResponse = function (action, xml) {
        return {
            token: this.extractXmlValue(xml, 'token') || this.extractXmlValue(xml, 'tokenWS'),
            url: this.environment + '/webpayserver/v3.cgi',
            vci: this.extractXmlValue(xml, 'vci'),
            amount: parseFloat(this.extractXmlValue(xml, 'amount') || '0'),
            status: this.extractXmlValue(xml, 'status') || 'AUTHORIZED',
            buyOrder: this.extractXmlValue(xml, 'buyOrder'),
            sessionId: this.extractXmlValue(xml, 'sessionId'),
            cardDetail: {
                card_number: this.extractXmlValue(xml, 'cardNumber') || '**** **** **** 0000'
            },
            accountingDate: this.extractXmlValue(xml, 'accountingDate') || '',
            transactionDate: this.extractXmlValue(xml, 'transactionDate') || new Date().toISOString(),
            authorizationCode: this.extractXmlValue(xml, 'authorizationCode') || '000000',
            paymentTypeCode: this.extractXmlValue(xml, 'paymentTypeCode') || 'CO',
            responseCode: parseInt(this.extractXmlValue(xml, 'responseCode') || '0')
        };
    };
    WebpayService.prototype.extractXmlValue = function (xml, tag) {
        var regex = new RegExp("<".concat(tag, "[^>]*>([^<]*)</").concat(tag, ">"), 'i');
        var match = xml.match(regex);
        return match ? match[1].trim() : '';
    };
    WebpayService.prototype.simulateCreateTransaction = function (buyOrder, sessionId, amount) {
        var mockToken = "mock_token_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
        return {
            token: mockToken,
            url: this.environment + '/webpayserver/v3.cgi',
            buyOrder: buyOrder,
            sessionId: sessionId,
            amount: amount
        };
    };
    WebpayService.prototype.simulateCommitTransaction = function (token) {
        return {
            vci: 'TSN',
            amount: 0,
            status: 'AUTHORIZED',
            buyOrder: token.split('_')[2] || 'mock_order',
            sessionId: token.split('_')[3] || 'mock_session',
            cardDetail: {
                card_number: '**** **** **** 1234'
            },
            accountingDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
            transactionDate: new Date().toISOString(),
            authorizationCode: '123456',
            paymentTypeCode: 'CO',
            responseCode: 0
        };
    };
    WebpayService.prototype.simulateRefundTransaction = function (token, amount) {
        return {
            token: token,
            authorizationCode: '123456',
            nullifiedAmount: amount,
            responseCode: 0,
            description: 'Reembolso procesado (simulación)'
        };
    };
    return WebpayService;
}());
exports.webpayService = new WebpayService();
exports.default = exports.webpayService;
