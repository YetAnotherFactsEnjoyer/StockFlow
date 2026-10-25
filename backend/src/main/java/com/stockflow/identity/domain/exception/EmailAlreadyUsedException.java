package com.stockflow.identity.domain.exception;

public class EmailAlreadyUsedException extends RuntimeException {

  public EmailAlreadyUsedException() {
    super("Email already in use");
  }
}
