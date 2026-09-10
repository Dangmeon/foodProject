package com.example.foodProject.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "food_items")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Long foodId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "major_category_code")
    private String majorCategoryCode; // 식품대분류코드

    @Column(name = "mid_category_code")
    private String midCategoryCode;   // 식품중분류코드

    @Column(name = "minor_category_code")
    private String minorCategoryCode; // 식품소분류코드

    @Column(name = "serving_size")
    private String servingSize;

    @Column(name = "calories")
    private Double calories;

    @Column(name = "carbohydrate")
    private Double carbohydrate;

    @Column(name = "protein")
    private Double protein;

    @Column(name = "fat")
    private Double fat;

    @Column(name = "sugar")
    private Double sugar;

    @Column(name = "sodium")
    private Double sodium;

    @Column(name = "cholesterol")
    private Double cholesterol; // 콜레스테롤(mg)

    @Column(name = "saturated_fat")
    private Double saturatedFat; // 포화지방산(g)

    @Column(name = "trans_fat")
    private Double transFat; // 트랜스지방산(g)

    @Column(name = "total_weight")
    private String totalWeight; // 식품중량 (예: 500g)

    @Column(name = "origin")
    private String origin; // 원산지국명 (예: 대한민국, 미국)

    @Column(name = "rep_food_name")
    private String repFood;

    @Builder.Default
    @Column(name = "view_count")
    private Long viewCount = 0L; // 조회수 (랭킹용, 기본값 0)

    @Builder.Default
    @Column(name = "like_count")
    private Long likeCount = 0L; // 찜하기 수 (랭킹용, 기본값 0)
}
