package com.example.foodProject.jwt;

import com.example.foodProject.dto.login.Role;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    private Key key;

    @PostConstruct
    protected void init(){
        byte[] keyBites = Base64.getDecoder().decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBites);
    }

    @Value("${jwt.expiration.access}")
    private long accessExpiration;

    @Value("${jwt.expiration.refresh}")
    private long refreshExpiration;

    // 1. Access Token 발급 (유저 정보 + 권한 포함)
    public String createAccessToken(String email, Role role){
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role.name());
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + accessExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. Refresh Token 발급 (권한 불필요, 레디스 대조용)
    public String createRefreshToken(String email){
        Date now = new Date();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + refreshExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰의 남은 유효 시간 계산 (Redis 블랙리스트용)
    public Long getExpiration(String token) {
        // 1. 토큰에 적힌 만료일 추출
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();

        // 2. 현재 시간 가져오기
        Long now = new Date().getTime();

        // 3. 만료일 - 현재 시간 = 남은 시간(밀리초) 반환
        return (expiration.getTime() - now);
    }

    // 토큰 유효성 및 만료 여부 검증
    public boolean validateToken(String token) {
        try{
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        }catch(Exception e){
            return false;
        }
    }
    // 토큰에서 Email(Subject) 추출
    public String getEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // 토큰에서 Role 추출
    public String getRole(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("role");
    }
}
