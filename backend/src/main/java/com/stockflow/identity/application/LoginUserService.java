package com.stockflow.identity.application;


import com.stockflow.identity.domain.User;
import com.stockflow.identity.domain.exception.*;
import com.stockflow.identity.persistence.UserRepository;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public LoginUserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User login(String email, String rawPassword) {
    if (rawPassword.getBytes(StandardCharsets.UTF_8).length > 72) {
      throw new InvalidCredentialsException();
    }
    String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

    User user = userRepository
      .findByEmail(normalizedEmail)
      .orElseThrow(InvalidCredentialsException::new);

    boolean passwordMatches = passwordEncoder.matches(rawPassword, user.getPasswordHash());

    if (!passwordMatches) {
      throw new InvalidCredentialsException();
    }
    return user;
  }
}
