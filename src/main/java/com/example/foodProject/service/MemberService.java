package com.example.foodProject.service;

import com.example.foodProject.dto.login.LoginRequest;
import com.example.foodProject.dto.login.LoginResponse;
import com.example.foodProject.dto.login.Role;
import com.example.foodProject.dto.login.SignUpRequest;
import com.example.foodProject.entity.login.Member;
import com.example.foodProject.jwt.JwtProvider;
import com.example.foodProject.repository.MemberRepository;
import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    public void signUp(SignUpRequest request) {
        if(memberRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        Member member = Member.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role(Role.USER)
                .build();

        memberRepository.save(member);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if(!passwordEncoder.matches(request.getPassword(), member.getPassword())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다");
        }

        String accessToken = jwtProvider.createAccessToken(member.getEmail(), member.getRole());
        String refreshToken = jwtProvider.createRefreshToken(member.getEmail());

        redisTemplate.opsForValue().set(
                "RT : " + accessToken,
                refreshToken,
                7,
                TimeUnit.DAYS);

        return new LoginResponse(accessToken, refreshToken);
    }

    @Transactional
    public void logout(String accessToken, String email) {
        if(redisTemplate.opsForValue().get("RT:" + email) != null){
            redisTemplate.delete("RT:" + email);
        }

        Long expiration = jwtProvider.getExpiration(accessToken);
        redisTemplate.opsForValue().set(
                accessToken,
                "logout",
                expiration,
                TimeUnit.MILLISECONDS
        );
    }
}
