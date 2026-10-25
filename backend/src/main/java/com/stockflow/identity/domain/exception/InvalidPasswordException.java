package com.stockflow.identity.domain.exception;

public class InvalidPasswordException extends RuntimeException {
  public InvalidPasswordException() {
    super("Password must not exceed 72 UTF-8 bytes");
  }
}
