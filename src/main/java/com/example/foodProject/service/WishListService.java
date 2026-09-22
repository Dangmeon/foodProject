package com.example.foodProject.service;

import com.example.foodProject.dto.wish.WishlistResponse;
import com.example.foodProject.entity.Product;
import com.example.foodProject.entity.login.Member;
import com.example.foodProject.entity.wish.WishList;
import com.example.foodProject.repository.FoodRepository;
import com.example.foodProject.repository.MemberRepository;
import com.example.foodProject.repository.WishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class WishListService {

    private final WishRepository wishRepository;
    private final MemberRepository memberRepository;
    private final FoodRepository foodRepository;

    @Transactional
    public WishlistResponse addWish(Long foodId){
        // 1. 현재 로그인 회원 조회
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원정보가 없습니다."));
        // 2. Product 조회
        Product product = foodRepository.findById(foodId)
                .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

        // 3. 중복 찜 확인
        if(wishRepository.existsByMemberAndProduct(member, product)){
            throw new IllegalArgumentException("이미 찜에 저장된 상품입니다.");
        }

        // 4. Wishlist 생성
       WishList wishList = new WishList(member, product);

        // 5. save
        wishRepository.save(wishList);

        // 6. WishlistResponse 반환
        return new WishlistResponse(product.getFoodId());
        // WishList는 Product를 참조하고 있으므로, 찜 추가 후 해당 상품의 foodId를 응답 DTO로 반환한다.
    }

    @Transactional
    public WishlistResponse deleteWish(Long foodId){
        // 1. 현재 로그인 회원 찾기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));
        // 2. Product 찾기
        Product product = foodRepository.findById(foodId)
                .orElseThrow(() -> new IllegalArgumentException("상품 정보가 없습니다."));

        // 3. "이 회원 + 이 상품" 조합의 WishList 찾기
        // 4. 없으면 예외
        // 5. 있으면 삭제
        WishList wishList = wishRepository.findByMemberAndProduct(member, product)
                .orElseThrow(() -> new IllegalArgumentException("찜 목록에 해당 상품이 없습니다."));

        wishRepository.delete(wishList);

        return new WishlistResponse(product.getFoodId());
    }

    @Transactional(readOnly = true)
    public List<WishlistResponse> getWishList(){
        // 1. 현재 로그인 회원 조회
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 없습니다."));
        // 2. 그 회원의 WishList 전체 조회
        // Repository
        List<WishList> wishLists = wishRepository.findByMember(member);
        // 3. List<WishList> -> List<WishlistResponse> 변환
        // 4. 반환
        // 엔티티는 DB용, DTO는 API 응답용이라서 변환해서 반환
        return wishLists.stream()
                .map(wishList ->
                    new WishlistResponse(wishList.getProduct().getFoodId())
                )
                .toList();
    }
}
