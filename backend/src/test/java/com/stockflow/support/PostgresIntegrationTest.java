package com.stockflow.support;

import com.stockflow.identity.domain.User;
import com.stockflow.identity.persistence.UserRepository;
import com.stockflow.shared.security.JwtService;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.postgresql.PostgreSQLContainer;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest(properties = {
  "spring.config.import=",
  "security.jwt.secret=test-signing-secret-longer-than-32-bytes",
  "security.jwt.issuer=stockflow",
  "security.jwt.expiration=1h",
  "security.cors.allowed-origins=https://frontend.example"
})
@AutoConfigureMockMvc
public abstract class PostgresIntegrationTest {
  // Docker required: disposable DB; never connects to an existing developer DB.
  private static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:17-alpine");
  static { POSTGRES.start(); }

  @DynamicPropertySource
  static void database(DynamicPropertyRegistry properties) {
    properties.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    properties.add("spring.datasource.username", POSTGRES::getUsername);
    properties.add("spring.datasource.password", POSTGRES::getPassword);
  }

  @Autowired protected MockMvc mvc;
  @Autowired protected ObjectMapper json;
  @Autowired protected UserRepository users;
  @Autowired protected JwtService jwtService;
  @Autowired protected PasswordEncoder passwords;
  protected User owner;
  protected String token;

  @BeforeEach
  void setUp() {
    users.deleteAllInBatch();
    owner = users.saveAndFlush(new User("owner@example.com", passwords.encode("password123")));
    token = jwtService.generateAccessToken(owner);
  }
}
