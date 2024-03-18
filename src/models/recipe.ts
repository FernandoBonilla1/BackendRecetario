import Ingredient from "./ingredient";

interface Recipe {
    id?: number;
    nombre: string;
    autor: string;
    ingredients: string[];
    pasos: string[];
}

interface RecipeData {
    id?: number;
    nombre: string;
    url?: string;
    eliminado: boolean;
    autor: string;
    valoracion: number;
    ingredients: string[];
    pasos: string[];
}

export {
    Recipe,
    RecipeData
}