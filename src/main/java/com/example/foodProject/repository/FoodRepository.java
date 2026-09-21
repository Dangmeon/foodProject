package com.example.foodProject.repository;

import com.example.foodProject.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface FoodRepository extends JpaRepository<Product, Long> {

    @Query("""
        SELECT p FROM Product p
        WHERE (:keyword IS NULL OR :keyword = '' OR p.foodName LIKE %:keyword%)
        AND (:minProtein IS NULL OR p.protein >= :minProtein)
        AND (:maxSugar IS NULL OR p.sugar <= :maxSugar)
        AND (:maxCalories IS NULL OR p.calories <= :maxCalories)
    """)
    Page<Product> findByFoodNameContaining(@Param("keyword") String keyword,
                                           @Param("minProtein") Double minProtein,
                                           @Param("maxSugar") Double maxSugar,
                                           @Param("maxCalories") Double maxCalories,
                                           Pageable pageable);
}
