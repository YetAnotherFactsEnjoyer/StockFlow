package com.stockflow.common.exception;

public class InvalidReferenceIdException extends RuntimeException {
    public InvalidReferenceIdException(String referenceType, String value) {
        super("Invalid " + referenceType + " UUID: " + value);
    }
}
