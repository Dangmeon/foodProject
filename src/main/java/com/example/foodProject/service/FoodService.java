package com.example.foodProject.service;

import com.example.foodProject.entity.Product;
import com.example.foodProject.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    @Transactional(readOnly = true)
    public List<Product> getAllFood(){
        return foodRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product getFoodById(Long id){
        return foodRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("해당 식품을 찾을 수 없습니다."));
    }

    // 포스트맨 테스트용 식품 추가
    @Transactional
    public Product createFood(Product product){
        return foodRepository.save(product);
    }
}
