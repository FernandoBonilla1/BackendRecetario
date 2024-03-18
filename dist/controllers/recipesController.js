"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusRecipes = exports.UpdateRecipe = exports.insertRecipes = exports.getRecipes = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../config/db"));
const getRecipes = (req, res) => {
    const { id_category } = req.body;
    try {
        db_1.default.query('CALL sp_get_recipes(?)', [id_category], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const recipes = JSON.parse(results[0][0].recipes);
            return res.status(200).json(recipes);
        });
    }
    catch (error) {
        console.error("Error al insertar el ingrediente:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.getRecipes = getRecipes;
const insertRecipes = (req, res) => {
    const { nombre, autor, datosJSON, id_categoria } = req.body;
    const img = req.file;
    let imagenUrl;
    let imageFullPath;
    if (!nombre || !autor || !datosJSON || !id_categoria) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    const { ingredientes, pasos } = JSON.parse(datosJSON);
    if (img) {
        const randomUUID = (0, uuid_1.v4)();
        const imagePath = path_1.default.join(__dirname, '..', 'public', 'images', 'recipes');
        const extension = path_1.default.extname(img.originalname);
        const imageName = `${nombre}_${randomUUID}${extension}`;
        imageFullPath = path_1.default.join(imagePath, imageName);
        fs_1.default.mkdirSync(imagePath, { recursive: true });
        fs_1.default.renameSync(img.path, imageFullPath);
        imagenUrl = `/images/recipes/${imageName}`;
    }
    const fecha_creacion = new Date().toISOString().split('T')[0];
    try {
        db_1.default.query('CALL sp_insert_recipe(?, ?, ?, ?, ?, ?, ?)', [nombre, imagenUrl, autor, JSON.stringify(ingredientes), JSON.stringify(pasos), id_categoria, fecha_creacion], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                if (imagenUrl && imageFullPath) {
                    fs_1.default.unlinkSync(imageFullPath);
                }
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const message = results[0][0].message;
            if (message === 201) {
                return res.status(201).json({ msg: "Receta insertada correctamente" });
            }
            else {
                if (imagenUrl && imageFullPath) {
                    console.log(imageFullPath);
                    fs_1.default.unlinkSync(imageFullPath);
                }
                return res.status(409).json({ msg: "Receta con el nombre especificado ya fue publicada por este autor" });
            }
        });
    }
    catch (error) {
        console.error("Error al insertar la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.insertRecipes = insertRecipes;
const UpdateStatusRecipes = (req, res) => {
    const { id, status } = req.body;
    if (!id || status === undefined) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    try {
        db_1.default.query('CALL sp_update_status_recipe(?, ?)', [id, status], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const message = results[0][0].message;
            if (message === 200) {
                return res.status(200).json({ msg: "Se cambio el estado de la receta correctamente" });
            }
            else {
                return res.status(404).json({ msg: "Receta no encontrada" });
            }
        });
    }
    catch (error) {
        console.error("Error al cambiar estado de la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.UpdateStatusRecipes = UpdateStatusRecipes;
const UpdateRecipe = (req, res) => {
    const { id, nombre, url, datosJSON, id_categoria } = req.body;
    const img = req.file;
    let imagenUrl;
    let imageFullPath;
    if (!id || !nombre || !url || !datosJSON || !id_categoria) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    const { ingredientes, pasos } = JSON.parse(datosJSON);
    if (img) {
        const randomUUID = (0, uuid_1.v4)();
        const imagePath = path_1.default.join(__dirname, '..', 'public', 'images', 'recipes');
        const extension = path_1.default.extname(img.originalname);
        const imageName = `${nombre}_${randomUUID}${extension}`;
        imageFullPath = path_1.default.join(imagePath, imageName);
        fs_1.default.mkdirSync(imagePath, { recursive: true });
        fs_1.default.renameSync(img.path, imageFullPath);
        imagenUrl = `/images/recipes/${imageName}`;
    }
    try {
        db_1.default.query('CALL sp_update_recipe(?, ?, ?, ?, ?, ?)', [id, nombre, imagenUrl, JSON.stringify(ingredientes), JSON.stringify(pasos), id_categoria], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                if (imagenUrl && imageFullPath) {
                    fs_1.default.unlinkSync(imageFullPath);
                }
                return res.status(500).json({ message: "Error interno del servidor" });
            }
            const message = results[0][0].message;
            if (message === 200) {
                if (url) {
                    const oldImagePath = path_1.default.join(__dirname, '..', 'public', url);
                    fs_1.default.unlink(oldImagePath, (unlinkError) => {
                        if (unlinkError) {
                            console.error("Error al eliminar el archivo antiguo:", unlinkError);
                        }
                    });
                    // try {
                    //     const oldImagePath = path.join(__dirname, '..', 'public', url);
                    //     fs.unlinkSync(oldImagePath);
                    // } catch (error) {
                    //     console.error("Error al eliminar el archivo antiguo:", error);
                    //     // No hagas nada si hay un error al eliminar el archivo antiguo
                    // }
                }
                return res.status(200).json({ msg: "Receta actualizada correctamente" });
            }
            else {
                if (imagenUrl && imageFullPath) {
                    fs_1.default.unlinkSync(imageFullPath);
                }
                return res.status(404).json({ msg: "Receta no encontrada" });
            }
        });
    }
    catch (error) {
        console.error("Error al actualizar la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
exports.UpdateRecipe = UpdateRecipe;
