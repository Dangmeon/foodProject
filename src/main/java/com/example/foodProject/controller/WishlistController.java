package com.example.foodProject.controller;

import com.example.foodProject.dto.wish.WishlistResponse;
import com.example.foodProject.entity.wish.WishList;
import com.example.foodProject.service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishListService wishListService;

    // 찜 추가
    // POST /api/wishlist/{foodId}
    @PostMapping("/{foodId}")
    public ResponseEntity<WishlistResponse> addWishlist(@PathVariable("foodId") Long foodId) {
        wishListService.addWish(foodId);
        return ResponseEntity.ok(new WishlistResponse(foodId));
    }

    // 찜 삭제
    // DELETE /api/wishlist/{foodId}
    @DeleteMapping("/{foodId}")
    public ResponseEntity<WishlistResponse> deleteWishlist(@PathVariable("foodId") Long foodId) {
        wishListService.deleteWish(foodId);
        return ResponseEntity.ok(new WishlistResponse(foodId));
    }

    // 내 찜 목록 조회
    // GET /api/wishlist
    @GetMapping
    public ResponseEntity<List<WishlistResponse>> getWishlist() {
        List<WishlistResponse> responses = wishListService.getWishList();
        return ResponseEntity.ok(responses);
    }
}
