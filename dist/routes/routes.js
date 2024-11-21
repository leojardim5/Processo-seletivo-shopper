"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("../controller/controller"));
const routes = (0, express_1.default)();
routes.post('/', (req, res) => controller_1.default.upload(req, res));
exports.default = routes;
