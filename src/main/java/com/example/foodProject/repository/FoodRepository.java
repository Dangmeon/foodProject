package com.example.foodProject.repository;

import com.example.foodProject.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepository extends JpaRepository<Product, Long> {

    List<Product> findByFoodNameContaining(String keyword);
}
