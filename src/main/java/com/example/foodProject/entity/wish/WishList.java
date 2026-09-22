package com.example.foodProject.entity.wish;

import com.example.foodProject.entity.Product;
import com.example.foodProject.entity.login.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(
        name="wishlist",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "user_wishlist",
                        columnNames = {"user_id", "product_id"}
                )
        }
)
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public WishList(Member member, Product product) {
        this.member = member;
        this.product = product;
    }

}
