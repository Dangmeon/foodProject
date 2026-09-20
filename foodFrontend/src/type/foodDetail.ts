// src/types/FoodDetail.ts
export interface FoodDetail {
    foodId: number;
    foodName: string;
    manufacturer: string;

    majorCategoryCode: string;
    midCategoryCode: string;
    minorCategoryCode: string;

    servingSize: string;
    totalWeight: string;
    origin: string;
    oneByte: string;

    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    sugar: number;
    sodium: number;
    cholesterol: number;
    saturatedFat: number;
    transFat: number;

    repFood: string;
    viewCount: number;
    likeCount: number;
}