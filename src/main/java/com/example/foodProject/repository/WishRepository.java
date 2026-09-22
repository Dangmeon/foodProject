package com.example.foodProject.repository;

import com.example.foodProject.entity.Product;
import com.example.foodProject.entity.login.Member;
import com.example.foodProject.entity.wish.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishRepository extends JpaRepository<WishList, Long> {

    List<WishList> findByMember(Member member);

    Optional<WishList> findByMemberAndProduct(Member member, Product product);

    boolean existsByMemberAndProduct(Member member, Product product);

    void deleteByMemberAndProduct(Member member, Product product);
}
