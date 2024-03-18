"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecetas = void 0;
const getRecetas = (req, res) => {
    return res.status(200).json({
        msg: "getRecetas"
    });
};
exports.getRecetas = getRecetas;
