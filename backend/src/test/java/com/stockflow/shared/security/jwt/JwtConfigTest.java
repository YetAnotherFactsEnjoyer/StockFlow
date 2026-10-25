package com.stockflow.shared.security.jwt;

import java.time.Duration;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtConfigTest {
  private final JwtConfig config = new JwtConfig();

  @Test
  void missingSecretFailsFast() {
    assertThrows(IllegalStateException.class,
      () -> config.jwtSecretKey(new JwtProperties(null, "template", Duration.ofHours(1))));
  }

  @Test
  void shortSecretFailsFast() {
    assertThrows(IllegalStateException.class,
      () -> config.jwtSecretKey(new JwtProperties("short", "template", Duration.ofHours(1))));
  }

  @Test
  void invalidIssuerAndExpirationFailFast() {
    var key = "a-strong-test-key-of-at-least-32-bytes";
    assertThrows(IllegalStateException.class,
      () -> config.jwtSecretKey(new JwtProperties(key, "", Duration.ofHours(1))));
    assertThrows(IllegalStateException.class,
      () -> config.jwtSecretKey(new JwtProperties(key, "test", Duration.ZERO)));
  }

  @Test
  void validSecretCreatesHs256Key() {
    var key = config.jwtSecretKey(new JwtProperties(
      "12345678901234567890123456789012", "starter", Duration.ofHours(1)));
    assertEquals(32, key.getEncoded().length);
    assertEquals("HmacSHA256", key.getAlgorithm());
  }
}
