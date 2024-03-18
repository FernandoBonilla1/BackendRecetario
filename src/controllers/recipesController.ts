import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import connection from '../config/db';


const getRecipes = (req: Request, res: Response) => {

    const { id_category } = req.body;
    try {
        connection.query('CALL sp_get_recipes(?)', [id_category] , (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            const recipes = JSON.parse(results[0][0].recipes);

            return res.status(200).json(recipes);
            
        });

    } catch (error) {
        console.error("Error al insertar el ingrediente:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

const insertRecipes = (req: Request, res: Response) => {

    const { nombre, autor, datosJSON, id_categoria} = req.body;
    const img = req.file;
    let imagenUrl: string | undefined;  
    let imageFullPath: string | undefined;

    if (!nombre || !autor || !datosJSON || !id_categoria) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    const { ingredientes, pasos } = JSON.parse(datosJSON);


    if(img){
        const randomUUID = uuidv4();
        const imagePath = path.join(__dirname, '..', 'public', 'images', 'recipes');
        const extension = path.extname(img.originalname);
        const imageName = `${nombre}_${randomUUID}${extension}`;
        imageFullPath = path.join(imagePath, imageName);

        fs.mkdirSync(imagePath, { recursive: true });

        fs.renameSync(img.path, imageFullPath);

        imagenUrl = `/images/recipes/${imageName}`;

    } 

    const fecha_creacion = new Date().toISOString().split('T')[0];
    
    try {

        connection.query('CALL sp_insert_recipe(?, ?, ?, ?, ?, ?, ?)', [nombre, imagenUrl, autor, JSON.stringify(ingredientes), JSON.stringify(pasos), id_categoria, fecha_creacion], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);

                if (imagenUrl && imageFullPath) {
                    fs.unlinkSync(imageFullPath);
                }
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            const message = results[0][0].message;
            if (message === 201) {
                return res.status(201).json({ msg: "Receta insertada correctamente" });
            } else{
                if (imagenUrl && imageFullPath) {
                    console.log(imageFullPath);
                    fs.unlinkSync(imageFullPath);
                }
                return res.status(409).json({ msg: "Receta con el nombre especificado ya fue publicada por este autor" });
            }
            
        });

    } catch (error) {
        console.error("Error al insertar la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

const UpdateStatusRecipes = (req: Request, res: Response) => {

    const { id, status} = req.body;

    if (!id || status === undefined) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    
    try {
        connection.query('CALL sp_update_status_recipe(?, ?)', [id, status], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);

                return res.status(500).json({ message: "Error interno del servidor" });
            }

            const message = results[0][0].message;
            if (message === 200) {
                return res.status(200).json({ msg: "Se cambio el estado de la receta correctamente" });
            } else{
                return res.status(404).json({ msg: "Receta no encontrada" });
            }
        });

    } catch (error) {
        console.error("Error al cambiar estado de la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}


const UpdateRecipe = (req: Request, res: Response) => {

    const { id, nombre, url, datosJSON, id_categoria} = req.body;
    const img = req.file;
    let imagenUrl: string | undefined;  
    let imageFullPath: string | undefined;

    if (!id || !nombre || !url || !datosJSON || !id_categoria) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    const { ingredientes, pasos } = JSON.parse(datosJSON);


    if(img){
        const randomUUID = uuidv4();
        const imagePath = path.join(__dirname, '..', 'public', 'images', 'recipes');
        const extension = path.extname(img.originalname);
        const imageName = `${nombre}_${randomUUID}${extension}`;
        imageFullPath = path.join(imagePath, imageName);

        fs.mkdirSync(imagePath, { recursive: true });

        fs.renameSync(img.path, imageFullPath);

        imagenUrl = `/images/recipes/${imageName}`;

    } 
    try {

        connection.query('CALL sp_update_recipe(?, ?, ?, ?, ?, ?)', [id, nombre, imagenUrl, JSON.stringify(ingredientes), JSON.stringify(pasos), id_categoria], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);

                if (imagenUrl && imageFullPath) {
                    fs.unlinkSync(imageFullPath);
                }
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            const message = results[0][0].message;
            if (message === 200) {
                if (url) {
                    const oldImagePath = path.join(__dirname, '..', 'public', url);
                    fs.unlink(oldImagePath, (unlinkError) => {
                        if (unlinkError) {
                            console.error("Error al eliminar el archivo antiguo:", unlinkError);
                        }
                    });
                }
                return res.status(200).json({ msg: "Receta actualizada correctamente" });
            } else{
                if (imagenUrl && imageFullPath) {
                    fs.unlinkSync(imageFullPath);
                }
                return res.status(404).json({ msg: "Receta no encontrada" });
            }
            
        });

    } catch (error) {
        console.error("Error al actualizar la receta:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export { getRecipes, 
    insertRecipes,
    UpdateRecipe,
    UpdateStatusRecipes
 };
