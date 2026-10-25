package com.stockflow.shared.security;

import com.stockflow.shared.exception.ApiError;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, ObjectMapper json) throws Exception {
    http
      .cors(Customizer.withDefaults())
      .csrf(csrf -> csrf.disable())
      .sessionManagement(session ->
        session.sessionCreationPolicy(
          SessionCreationPolicy.STATELESS
        )
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(
          HttpMethod.POST,
          "/api/v1/auth/register",
          "/api/v1/auth/login"
        ).permitAll()
        .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
        .anyRequest().authenticated())
      .exceptionHandling(errors -> errors
        .authenticationEntryPoint((request, response, exception) -> writeError(response, json, 401))
        .accessDeniedHandler((request, response, exception) -> writeError(response, json, 403)))
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())
        .authenticationEntryPoint((request, response, exception) -> writeError(response, json, 401))
        .accessDeniedHandler((request, response, exception) -> writeError(response, json, 403)));
    return http.build();
  }

  @Bean
  public UrlBasedCorsConfigurationSource corsConfigurationSource(
    @Value("${security.cors.allowed-origins:}") List<String> allowedOrigins
  ) {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(allowedOrigins);
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    return source;
  }

  private void writeError(HttpServletResponse response, ObjectMapper json, int status)
    throws java.io.IOException {
    response.setStatus(status);
    if (status == 401) {
      response.setHeader("WWW-Authenticate", "Bearer");
    }
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    json.writeValue(response.getOutputStream(), new ApiError(
      status == 401 ? "UNAUTHORIZED" : "FORBIDDEN",
      status == 401 ? "Authentication required" : "Access denied", Instant.now()));
  }
}
