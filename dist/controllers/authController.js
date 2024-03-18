"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contrasenna } = req.body;
    if (!correo || !contrasenna) {
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }
    try {
        db_1.default.query('CALL sp_user_by_correo(?)', [correo], (error, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            if (results[0].length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            const userData = results[0][0];
            try {
                const validPassword = yield bcryptjs_1.default.compare(contrasenna, userData.contrasenna);
                if (!validPassword) {
                    return res.status(401).json({
                        msg: "Contraseña inválida"
                    });
                }
                delete userData.contrasenna;
                return res.status(200).json(userData);
            }
            catch (bcryptError) {
                console.error("Error al comparar contraseñas:", bcryptError);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        }));
    }
    catch (error) {
        console.error("Error al autenticar datos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const { rut, nombre, telefono, correo, contrasenna } = userData;
    if (!rut || !nombre || !correo || !contrasenna) {
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }
    try {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(userData.contrasenna, salt);
        db_1.default.query('CALL sp_insert_user(?, ?, ?, ?, ?)', [rut, nombre, telefono, correo, hashedPassword], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const message = results[0][0].message;
            if (message === 201) {
                return res.status(201).json({ msg: "Usuario insertado correctamente" });
            }
            else {
                return res.status(409).json({ msg: "Usuario con el resultado especificado ya existe" });
            }
        });
    }
    catch (error) {
        console.error("Error al generar el hash de la contraseña:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.register = register;
