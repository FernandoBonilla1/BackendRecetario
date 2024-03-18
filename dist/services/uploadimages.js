"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardarImagen = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
function guardarImagen(img, callback) {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExt = path_1.default.extname(img.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        return callback('La imagen debe ser en formato png o jpg.');
    }
    const fileName = (0, uuid_1.v4)() + fileExt;
    const imagePath = path_1.default.join(__dirname, '../public/images/recipes/', fileName);
    fs_1.default.rename(img.path, imagePath, (err) => {
        if (err) {
            console.error(err);
            return callback('Error al guardar la imagen.');
        }
        const imageUrl = `/images/recipes/${fileName}`;
        callback(null, imageUrl);
    });
}
exports.guardarImagen = guardarImagen;
