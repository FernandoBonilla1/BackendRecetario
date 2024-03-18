import { Request, Response } from 'express';
import connection from '../config/db';

import Ingredient from '../models/ingredient';

const getIngredients = (req: Request, res: Response) => {

    try {

        connection.query('CALL sp_get_ingredients()', (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            const ingredients = JSON.parse(results[0][0].ingredients);

            return res.status(200).json(ingredients);
            
        });

    } catch (error) {
        console.error("Error al insertar el ingrediente:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

const insertIngredients = (req: Request, res:Response) => {

    const ingredientData: Ingredient = req.body;

    const {nombre} = ingredientData;

    if(!nombre){
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }

    try {

        connection.query('CALL sp_insert_ingredient(?, ?)', [nombre], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            const message = results[0][0].message;
            if (message === 201) {
                return res.status(201).json({ msg: "Ingrediente insertado correctamente" });
            } else{
                return res.status(409).json({ msg: "Ingrediente con el nombre especificado ya existe" });
            }
            
        });

    } catch (error) {
        console.error("Error al insertar el ingrediente:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }

}

const UpdateIngredients = (req: Request, res:Response) => {

}

export {
    getIngredients,
    insertIngredients,
    UpdateIngredients
}
