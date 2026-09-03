package com.example.foodProject.dto;

import com.example.foodProject.entity.Product;

public record FoodSimpleResponse(
        Long foodId,
        String foodName,
        String manufacturer,
        Double calories,
        Double protein,
        Double sugar
        // Long likeCount // 추후 찜하기 기능 추가 시 주석 해제
) {
    // Entity를 받아서 DTO로 변환해주는 팩토리 메서드 (실무에서 아주 많이 씁니다)
    public static FoodSimpleResponse from(Product foodItem) {
        return new FoodSimpleResponse(
                foodItem.getFoodId(),
                foodItem.getFoodName(),
                foodItem.getManufacturer(),
                foodItem.getCalories(),
                foodItem.getProtein(),
                foodItem.getSugar()
        );
    }
}