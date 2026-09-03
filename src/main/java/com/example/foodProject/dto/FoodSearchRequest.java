package com.example.foodProject.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FoodSearchRequest {

    // 1. 기본 검색
    private String keyword;         // 검색어 (예: "치즈스틱")
    private String category;        // 카테고리 필터 (예: "가공식품")

    // 2. 영양성분 다중 필터 (체크박스/슬라이더용)
    private Double minProtein;      // 단백질 하한선
    private Double maxSugar;        // 당류 상한선
    private Double maxCalories;     // 칼로리 상한선
    private Double maxFat;          // 지방 상한선

    // 3. 정렬 조건 (랭킹 시스템의 핵심)
    private String sortBy;
}
