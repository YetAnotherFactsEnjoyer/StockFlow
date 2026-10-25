package com.stockflow.shared.exception;

import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {
  void endpoint(String email) { }

  @Test
  void invalidBodyMentionsTheField() throws Exception {
    Method method = getClass().getDeclaredMethod("endpoint", String.class);
    var binding = new BeanPropertyBindingResult(new Object(), "request");
    binding.addError(new FieldError("request", "email", "invalid email"));
    var result = new GlobalExceptionHandler().invalidBody(
      new MethodArgumentNotValidException(new MethodParameter(method, 0), binding));
    assertEquals("VALIDATION_FAILED", result.code());
    assertTrue(result.message().contains("email"));
  }

  @Test
  void unexpectedExceptionCannotLeakSecrets() {
    var result = new GlobalExceptionHandler().unexpected(
      new IllegalStateException("connection failed password=secret"));
    assertEquals(500, result.getStatusCode().value());
    assertEquals("INTERNAL_ERROR", result.getBody().code());
    assertFalse(result.getBody().message().contains("secret"));
  }

  @Test
  void databaseConstraintExceptionIsSanitized() {
    var result = new GlobalExceptionHandler().dataConflict(
      new DataIntegrityViolationException("INSERT password_hash=secret"));
    assertEquals("DATA_CONFLICT", result.code());
    assertFalse(result.message().contains("secret"));
  }
}
