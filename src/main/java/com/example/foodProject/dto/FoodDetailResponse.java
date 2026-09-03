package com.example.foodProject.dto;

import com.example.foodProject.entity.Product;

public record FoodDetailResponse(
        Long foodId,
        String foodName,
        String manufacturer,
        String category,
        String servingSize,

        // 영양 성분 전체
        Double calories,
        Double carbohydrate,
        Double protein,
        Double fat,
        Double sugar,
        Double sodium,
        String repFood

        // String aiAnalysisComment // 추후 "헬스인에게 추천하는 이유" 등 AI 응답 필드 추가
) {
    public static FoodDetailResponse from(Product foodItem) {
        return new FoodDetailResponse(
                foodItem.getFoodId(),
                foodItem.getFoodName(),
                foodItem.getManufacturer(),
                foodItem.getCategory(),
                foodItem.getServingSize(),
                foodItem.getCalories(),
                foodItem.getCarbohydrate(),
                foodItem.getProtein(),
                foodItem.getFat(),
                foodItem.getSugar(),
                foodItem.getSodium(),
                foodItem.getRepFood()
        );
    }
}