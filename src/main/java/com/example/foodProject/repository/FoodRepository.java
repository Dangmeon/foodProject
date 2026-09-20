package com.example.foodProject.repository;

import com.example.foodProject.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FoodRepository extends JpaRepository<Product, Long> {

    Page<Product> findByFoodNameContaining(String keyword, Pageable pageable);
}
