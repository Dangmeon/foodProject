package com.example.foodProject.jwt;

import ch.qos.logback.core.util.StringUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;

    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Request Header에서 "Bearer 토큰" 추출
        String token = resolveToken(request);

        // 2. 토큰 유효성 검증
        if (token != null && jwtProvider.validateToken(token)) {

            // 3. Redis 블랙리스트 확인 (로그아웃된 토큰인지 체크)
            String isLogout = redisTemplate.opsForValue().get(token);

            if (!"logout".equals(isLogout)) {
                // 토큰에서 유저 식별값(Email)과 권한 정보 추출
                String email = jwtProvider.getEmail(token);
                String role = jwtProvider.getRole(token); // e.g. "USER"

                // 스프링 시큐리티 인증 객체(Authentication) 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                // 시큐리티 컨텍스트에 인증 정보 등록 (출입증 부여)
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

}
