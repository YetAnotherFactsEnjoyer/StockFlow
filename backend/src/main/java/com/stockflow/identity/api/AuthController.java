package com.stockflow.identity.api;

import com.stockflow.identity.application.RegisterUserService;
import com.stockflow.identity.application.LoginUserService;
import com.stockflow.identity.api.login.LoginRequest;
import com.stockflow.identity.api.login.LoginResponse;
import com.stockflow.identity.api.register.RegisterRequest;
import com.stockflow.identity.api.register.RegisterResponse;
import com.stockflow.shared.security.JwtService;
import com.stockflow.identity.domain.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final RegisterUserService registerUserService;
  private final LoginUserService loginUserService;
  private final JwtService jwtService;

  public AuthController(
    RegisterUserService registerUserService,
    LoginUserService loginUserService,
    JwtService jwtService
  ) {
    this.registerUserService = registerUserService;
    this.loginUserService = loginUserService;
    this.jwtService = jwtService;
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
    User user = registerUserService.register(request.email(), request.password());
    return RegisterResponse.from(user);
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    User user = loginUserService.login(request.email(), request.password());
    String accessToken = jwtService.generateAccessToken(user);
    return LoginResponse.bearer(accessToken);
  }
}
