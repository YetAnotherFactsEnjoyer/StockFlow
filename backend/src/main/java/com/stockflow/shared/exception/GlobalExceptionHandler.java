package com.stockflow.shared.exception;

import com.stockflow.identity.domain.exception.EmailAlreadyUsedException;
import com.stockflow.identity.domain.exception.InvalidCredentialsException;
import com.stockflow.identity.domain.exception.InvalidPasswordException;
import com.stockflow.identity.domain.exception.UserNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EmailAlreadyUsedException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public ApiError emailConflict(EmailAlreadyUsedException ignored) {
    return error("EMAIL_ALREADY_USED", "Email already in use");
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ApiError invalidCredentials(InvalidCredentialsException ignored) {
    return error("INVALID_CREDENTIALS", "Invalid email or password");
  }

  @ExceptionHandler(InvalidPasswordException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiError invalidPassword(InvalidPasswordException exception) {
    return error("INVALID_PASSWORD", exception.getMessage());
  }

  @ExceptionHandler(UserNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ApiError userNotFound(UserNotFoundException ignored) {
    return error("USER_NOT_FOUND", "User not found");
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiError invalidBody(MethodArgumentNotValidException exception) {
    var fields = exception.getBindingResult().getFieldErrors();
    String message = fields.isEmpty()
      ? "Invalid request"
      : fields.getFirst().getField() + ": " + fields.getFirst().getDefaultMessage();
    return error("VALIDATION_FAILED", message);
  }

  @ExceptionHandler({HttpMessageNotReadableException.class,
    MethodArgumentTypeMismatchException.class,
    MissingServletRequestParameterException.class,
    ConstraintViolationException.class,
    HandlerMethodValidationException.class})
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ApiError malformedRequest(Exception ignored) {
    return error("INVALID_REQUEST", "Invalid request");
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public ApiError dataConflict(DataIntegrityViolationException ignored) {
    return error("DATA_CONFLICT", "Request conflicts with existing data");
  }

  @ExceptionHandler(AuthenticationException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public ApiError unauthenticated(AuthenticationException ignored) {
    return error("UNAUTHORIZED", "Authentication required");
  }

  @ExceptionHandler(AccessDeniedException.class)
  @ResponseStatus(HttpStatus.FORBIDDEN)
  public ApiError forbidden(AccessDeniedException ignored) {
    return error("FORBIDDEN", "Access denied");
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> unexpected(Exception exception) {
    if (exception instanceof ErrorResponse frameworkError) {
      return ResponseEntity.status(frameworkError.getStatusCode())
        .body(error("REQUEST_FAILED", "Request could not be processed"));
    }
    return ResponseEntity.internalServerError()
      .body(error("INTERNAL_ERROR", "An unexpected error occurred"));
  }

  private ApiError error(String code, String message) {
    return new ApiError(code, message, Instant.now());
  }
}
