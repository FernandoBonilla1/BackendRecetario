import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export function guardarImagen(img: Express.Multer.File, callback: (error: string | null, imageUrl?: string) => void) {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExt = path.extname(img.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
        return callback('La imagen debe ser en formato png o jpg.');
    }

    const fileName = uuidv4() + fileExt;
    const imagePath = path.join(__dirname, '../public/images/recipes/', fileName);

    fs.rename(img.path, imagePath, (err) => {
        if (err) {
            console.error(err);
            return callback('Error al guardar la imagen.');
        }
        const imageUrl = `/images/recipes/${fileName}`;
        callback(null, imageUrl);
    });
}