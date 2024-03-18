import { Request, Response } from 'express';
import connection from '../config/db';

import bcrypt from 'bcryptjs';

import User from '../models/user';

const login = async (req: Request, res: Response) => {
    const { correo, contrasenna} = req.body;

    if(!correo || !contrasenna){
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }

    try {
        connection.query('CALL sp_user_by_correo(?)', [correo], async (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            if (results[0].length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            const userData = results[0][0];

            try {
                const validPassword = await bcrypt.compare(contrasenna, userData.contrasenna);

                if (!validPassword) {
                    return res.status(401).json({
                        msg: "Contraseña inválida"
                    });
                }

                delete userData.contrasenna;

                return res.status(200).json(userData);
            } catch (bcryptError) {
                console.error("Error al comparar contraseñas:", bcryptError);
                return res.status(500).json({ message: "Error interno del servidor" });
            }
        });

    } catch (error) {
        console.error("Error al autenticar datos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

const register = async (req: Request, res: Response) => {

    const userData: User = req.body;
    const { rut, nombre, telefono, correo, contrasenna } = userData;
    if(!rut || !nombre || !correo || !contrasenna){
        return res.status(400).json({
            message: "Faltan campos obligatorios"
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.contrasenna, salt);

        connection.query('CALL sp_insert_user(?, ?, ?, ?, ?)', [rut, nombre, telefono, correo, hashedPassword], (error, results) => {
            if (error) {
                console.error("Error al ejecutar el procedimiento almacenado:", error);
                return res.status(500).json({ message: "Error interno del servidor" });
            }

            const message = results[0][0].message;
            if (message === 201) {
                return res.status(201).json({ msg: "Usuario insertado correctamente" });
            } else{
                return res.status(409).json({ msg: "Usuario con el resultado especificado ya existe" });
            }
            
        });

    } catch (error) {
        console.error("Error al generar el hash de la contraseña:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export { login, register };