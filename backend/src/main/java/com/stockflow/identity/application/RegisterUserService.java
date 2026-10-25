package com.stockflow.identity.application;

import com.stockflow.identity.domain.User;
import com.stockflow.identity.domain.exception.EmailAlreadyUsedException;
import com.stockflow.identity.domain.exception.InvalidPasswordException;
import com.stockflow.identity.persistence.UserRepository;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegisterUserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public RegisterUserService( UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public User register(String email, String password) {
    if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
      throw new InvalidPasswordException();
    }
    String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

    if (userRepository.existsByEmail(normalizedEmail)) {
      throw new EmailAlreadyUsedException();
    }

    User user = new User(normalizedEmail, passwordEncoder.encode(password));

    return userRepository.save(user);
  }
}
