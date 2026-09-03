package com.example.foodProject.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "food_id")
    private Long foodId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "category", nullable = false)
    private String category;

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

    @Column(name = "rep_food_name")
    private String repFood;

    @Column(name = "view_count")
    private Long viewCount = 0L; // 조회수 (랭킹용, 기본값 0)

    @Column(name = "like_count")
    private Long likeCount = 0L; // 찜하기 수 (랭킹용, 기본값 0)
}
