"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recipesController_1 = require("../controllers/recipesController");
const ingredientsController_1 = require("../controllers/ingredientsController");
const multer_1 = require("../multer");
const router = (0, express_1.Router)();
//Rutas recetas
router.get('/recetas', recipesController_1.getRecipes);
router.post('/recetas', multer_1.upload.single('img'), recipesController_1.insertRecipes);
router.put('/recetas', multer_1.upload.single('img'), recipesController_1.UpdateRecipe);
router.put('/recetas/status', recipesController_1.UpdateStatusRecipes);
//Rutas Ingredientes
router.get('/ingredientes', ingredientsController_1.getIngredients);
router.post('/ingredientes', ingredientsController_1.insertIngredients);
router.put('/ingredientes', ingredientsController_1.UpdateIngredients);
exports.default = router;
