package com.stockflow.shared.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.UUID;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

@Configuration
@EnableConfigurationProperties(JwtProperties.class)
public class JwtConfig {
  @Bean
  public SecretKey jwtSecretKey(JwtProperties properties) {
    if (properties.secret() == null || properties.secret().isBlank()) {
      throw new IllegalStateException("JWT_SECRET must be configured");
    }
    byte[] keyBytes = properties.secret().getBytes(StandardCharsets.UTF_8);
    if (keyBytes.length < 32) {
      throw new IllegalStateException("JWT_SECRET must contain at least 32 UTF-8 bytes for HS256");
    }
    if (properties.issuer() == null || properties.issuer().isBlank()) {
      throw new IllegalStateException("JWT issuer must not be blank");
    }
    if (properties.expiration() == null || properties.expiration().isNegative()
      || properties.expiration().isZero()) {
      throw new IllegalStateException("JWT expiration must be positive");
    }
    return new SecretKeySpec(keyBytes, "HmacSHA256");
  }

  @Bean
  public JwtEncoder jwtEncoder(SecretKey secretKey) {
    return NimbusJwtEncoder
      .withSecretKey(secretKey)
      .algorithm(MacAlgorithm.HS256)
      .build();
  }

  @Bean
  public JwtDecoder jwtDecoder(SecretKey secretKey, JwtProperties properties) {
    NimbusJwtDecoder decoder = NimbusJwtDecoder
      .withSecretKey(secretKey)
      .macAlgorithm(MacAlgorithm.HS256)
      .build();

    OAuth2TokenValidator<Jwt> requiredClaims = jwt -> {
      try {
        String subject = jwt.getSubject();
        if (subject == null || !UUID.fromString(subject).toString().equals(subject)
          || jwt.getExpiresAt() == null) {
          throw new IllegalArgumentException();
        }
        return OAuth2TokenValidatorResult.success();
      } catch (IllegalArgumentException exception) {
        return OAuth2TokenValidatorResult.failure(
          new OAuth2Error("invalid_token", "Invalid token claims", null));
      }
    };
    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
      JwtValidators.createDefaultWithIssuer(properties.issuer()), requiredClaims));

    return decoder;
  }
}
