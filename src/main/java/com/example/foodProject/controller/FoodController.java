package com.example.foodProject.controller;

import com.example.foodProject.dto.FoodDetailResponse;
import com.example.foodProject.entity.Product;
import com.example.foodProject.repository.FoodRepository;
import com.example.foodProject.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "http://localhost:8443")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;
    private final FoodRepository foodRepository;

    @GetMapping
    public ResponseEntity<Page<Product>> getAllFood(Pageable pageable) {
        return ResponseEntity.ok(foodService.getAllFood(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDetailResponse> getFoodById(@PathVariable Long id) {
        Product product = foodService.getFoodById(id);

        return ResponseEntity.ok(FoodDetailResponse.from(product));
    }

    @PostMapping
    public ResponseEntity<Product> createFood(@RequestBody Product product) {
        return ResponseEntity.ok(foodService.createFood(product));
    }

    @GetMapping("/search")
    // required는 그 파라미터가 반드시 있어야 하는지를 정하는 옵션 = keyword가 없어도 요청을 허용한다 => (required = false) = 이 쿼리 파라미터는 선택사항이다.
    public ResponseEntity<Page<Product>> searchFood(@RequestParam(required = false) String keyword,
                                                    @RequestParam(required = false) Double minProtein,
                                                    @RequestParam(required = false) Double maxSugar,
                                                    @RequestParam(required = false) Double maxCalories,
                                                    Pageable pageable) {
        return ResponseEntity.ok(foodService.searchFood(keyword,
                minProtein,
                maxSugar,
                maxCalories,
                pageable));
    }
}
