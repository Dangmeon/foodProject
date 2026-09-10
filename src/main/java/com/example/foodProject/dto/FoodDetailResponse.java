package com.example.foodProject.dto;

import com.example.foodProject.entity.Product;

public record FoodDetailResponse(
        Long foodId,
        String foodName,
        String manufacturer,

        // 카테고리 코드 (기존 category 대체)
        String majorCategoryCode,
        String midCategoryCode,
        String minorCategoryCode,

        String servingSize,
        String totalWeight, // 중량 추가
        String origin,      // 원산지 추가

        // 영양 성분 전체
        Double calories,
        Double carbohydrate,
        Double protein,
        Double fat,
        Double sugar,
        Double sodium,
        Double cholesterol,  // 콜레스테롤 추가
        Double saturatedFat, // 포화지방산 추가
        Double transFat,     // 트랜스지방산 추가

        String repFood,
        Long viewCount,      // 조회수 추가
        Long likeCount       // 찜하기 수 추가

        // String aiAnalysisComment // 추후 추가 예정
) {
    public static FoodDetailResponse from(Product foodItem) {
        return new FoodDetailResponse(
                foodItem.getFoodId(),
                foodItem.getFoodName(),
                foodItem.getManufacturer(),

                foodItem.getMajorCategoryCode(),
                foodItem.getMidCategoryCode(),
                foodItem.getMinorCategoryCode(),

                foodItem.getServingSize(),
                foodItem.getTotalWeight(),
                foodItem.getOrigin(),

                foodItem.getCalories(),
                foodItem.getCarbohydrate(),
                foodItem.getProtein(),
                foodItem.getFat(),
                foodItem.getSugar(),
                foodItem.getSodium(),
                foodItem.getCholesterol(),
                foodItem.getSaturatedFat(),
                foodItem.getTransFat(),

                foodItem.getRepFood(),
                foodItem.getViewCount(),
                foodItem.getLikeCount()
        );
    }
}