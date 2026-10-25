package com.stockflow.shared.security;

import com.stockflow.identity.domain.User;
import com.stockflow.shared.security.jwt.JwtProperties;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {
  private final JwtEncoder jwtEncoder;
  private final JwtProperties properties;

  public JwtService(JwtEncoder jwtEncoder, JwtProperties properties) {
    this.jwtEncoder = jwtEncoder;
    this.properties = properties;
  }

  public String generateAccessToken(User user) {
    Instant now = Instant.now();

    JwtClaimsSet claims = JwtClaimsSet.builder()
      .issuer(properties.issuer())
      .subject(user.getId().toString())
      .issuedAt(now)
      .expiresAt(now.plus(properties.expiration()))
      .build();

    JwsHeader header = JwsHeader
      .with(MacAlgorithm.HS256)
      .build();

    return jwtEncoder
      .encode(JwtEncoderParameters.from(header, claims))
      .getTokenValue();
  }
}
