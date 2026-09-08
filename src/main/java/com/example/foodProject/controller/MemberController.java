package com.example.foodProject.controller;

import com.example.foodProject.dto.login.LoginRequest;
import com.example.foodProject.dto.login.LoginResponse;
import com.example.foodProject.dto.login.SignUpRequest;
import com.example.foodProject.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignUpRequest request) {
        memberService.signUp(request);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = memberService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader("Authorization") String accessToken,
            @RequestParam String email) {
        String resolvedToken = accessToken.substring(7);

        memberService.logout(resolvedToken, email);
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}
