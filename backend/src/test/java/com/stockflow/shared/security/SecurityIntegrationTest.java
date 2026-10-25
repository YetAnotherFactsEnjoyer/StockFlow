package com.stockflow.shared.security;

import com.stockflow.support.PostgresIntegrationTest;
import java.time.Instant;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class SecurityIntegrationTest extends PostgresIntegrationTest {
  @Autowired JwtEncoder encoder;

  @Test
  void registrationLoginAndAccountMeWorkWithoutExposingHashes() throws Exception {
    var body = "{\"email\":\"New@Example.com\",\"password\":\"password123\"}";
    mvc.perform(post("/api/v1/auth/register").contentType("application/json").content(body))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.email").value("new@example.com"))
      .andExpect(jsonPath("$.passwordHash").doesNotExist());
    mvc.perform(post("/api/v1/auth/register").contentType("application/json").content(body))
      .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("EMAIL_ALREADY_USED"));
    var login = mvc.perform(post("/api/v1/auth/login").contentType("application/json").content(body))
      .andExpect(status().isOk()).andExpect(jsonPath("$.tokenType").value("Bearer"))
      .andReturn().getResponse().getContentAsString();
    var tokenValue = json.readTree(login).get("accessToken").asText();
    mvc.perform(get("/api/v1/account/me").header("Authorization", "Bearer " + tokenValue))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.email").value("new@example.com"))
      .andExpect(jsonPath("$.passwordHash").doesNotExist());
    mvc.perform(post("/api/v1/auth/login").contentType("application/json")
      .content(body.replace("password123", "incorrect-password")))
      .andExpect(status().isUnauthorized())
      .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
  }

  @Test
  void protectedResourcesRejectMissingInvalidAndExpiredTokens() throws Exception {
    mvc.perform(get("/api/v1/account/me"))
      .andExpect(status().isUnauthorized());
    mvc.perform(get("/api/v1/account/me").header("Authorization", "Bearer bogus"))
      .andExpect(status().isUnauthorized());
    mvc.perform(get("/api/v1/account/me").header("Authorization", "Bearer " + token))
      .andExpect(status().isOk());
    var badSigner = NimbusJwtEncoder.withSecretKey(new SecretKeySpec(
      "different-signer-at-least-32-bytes-key".getBytes(java.nio.charset.StandardCharsets.UTF_8),
      "HmacSHA256")).algorithm(MacAlgorithm.HS256).build();
    for (var bad : List.of(
      signed(encoder, "stockflow", owner.getId().toString(), Instant.now().minusSeconds(90)),
      signed(encoder, "some-other-issuer", owner.getId().toString(), Instant.now().plusSeconds(900)),
      signed(encoder, "stockflow", "not-a-uuid", Instant.now().plusSeconds(900)),
      signed(badSigner, "stockflow", owner.getId().toString(), Instant.now().plusSeconds(900)))) {
      mvc.perform(get("/api/v1/account/me").header("Authorization", "Bearer " + bad))
        .andExpect(status().isUnauthorized());
    }
  }

  @Test
  void publicHealthAndCorsRestrictionsAreApplied() throws Exception {
    mvc.perform(get("/actuator/health")).andExpect(status().isOk());
    mvc.perform(options("/api/v1/account/me").header("Origin", "https://frontend.example")
      .header("Access-Control-Request-Method", "GET"))
      .andExpect(status().isOk())
      .andExpect(header().string("Access-Control-Allow-Origin", "https://frontend.example"));
    mvc.perform(options("/api/v1/account/me").header("Origin", "https://evil.example")
      .header("Access-Control-Request-Method", "GET"))
      .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
  }

  @Test
  void overlongBcryptPasswordsCannotRegister() throws Exception {
    var body = json.writeValueAsString(java.util.Map.of("email", "long@example.com", "password", "é".repeat(37)));
    mvc.perform(post("/api/v1/auth/register").contentType("application/json").content(body))
      .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("INVALID_PASSWORD"));
    assertFalse(users.existsByEmail("long@example.com"));
  }

  private String signed(JwtEncoder signer, String issuer, String subject, Instant expiry) {
    var claims = JwtClaimsSet.builder().issuer(issuer).subject(subject)
      .issuedAt(Instant.now().minusSeconds(120)).expiresAt(expiry).build();
    return signer.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
      .getTokenValue();
  }
}
