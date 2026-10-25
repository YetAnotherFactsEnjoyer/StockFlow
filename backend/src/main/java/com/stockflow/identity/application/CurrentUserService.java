package com.stockflow.identity.application;

import com.stockflow.identity.domain.User;
import com.stockflow.identity.domain.exception.UserNotFoundException;
import com.stockflow.identity.persistence.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CurrentUserService {
  private final UserRepository userRepository;

  public CurrentUserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User getCurrentUser(Jwt jwt) {
    UUID userId = extractUserId(jwt);
    return userRepository
      .findById(userId)
      .orElseThrow(UserNotFoundException::new);
  }

  private UUID extractUserId(Jwt jwt) {
    return UUID.fromString(jwt.getSubject());
  }
}
