import { Router } from "express";
import { UpdateRecipe, UpdateStatusRecipes, getRecipes, insertRecipes } from "../controllers/recipesController"
import { UpdateIngredients, getIngredients, insertIngredients } from "../controllers/ingredientsController";
import { upload } from "../multer";

const router = Router();

//Rutas recetas
router.get('/recetas', getRecipes);
router.post('/recetas', upload.single('img'), insertRecipes);
router.put('/recetas', upload.single('img'), UpdateRecipe);
router.put('/recetas/status', UpdateStatusRecipes);


//Rutas Ingredientes
router.get('/ingredientes', getIngredients);
router.post('/ingredientes', insertIngredients);
router.put('/ingredientes', UpdateIngredients);
export default router;