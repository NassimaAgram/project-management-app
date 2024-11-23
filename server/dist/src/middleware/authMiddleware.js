"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuthentication = void 0;
const express_1 = require("@clerk/express");
// Middleware for strict authentication
exports.requireAuthentication = express_1.requireAuth;
