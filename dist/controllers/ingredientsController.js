"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIngredients = exports.insertIngredients = exports.getIngredients = void 0;
const db_1 = __importDefault(require("../config/db"));
const getIngredients = (req, res) => {
    try {
        db_1.default.query('CALL sp_get_ingredients()', (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const ingredients = JSON.parse(results[0][0].ingredients);
            return res.status(200).json(ingredients);
        });
    }
    catch (error) {
        console.error("Error al insertar el ingrediente:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getIngredients = getIngredients;
const insertIngredients = (req, res) => {
    const ingredientData = req.body;
    const { nombre } = ingredientData;
    if (!nombre) {
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }
    try {
        db_1.default.query('CALL sp_insert_ingredient(?, ?)', [nombre], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const message = results[0][0].message;
            if (message === 201) {
                return res.status(201).json({ msg: "Ingrediente insertado correctamente" });
            }
            else {
                return res.status(409).json({ msg: "Ingrediente con el nombre especificado ya existe" });
            }
        });
    }
    catch (error) {
        console.error("Error al insertar el ingrediente:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.insertIngredients = insertIngredients;
const UpdateIngredients = (req, res) => {
};
exports.UpdateIngredients = UpdateIngredients;
