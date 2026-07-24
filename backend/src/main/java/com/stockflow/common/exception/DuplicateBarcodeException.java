package com.stockflow.common.exception;

public class DuplicateBarcodeException extends RuntimeException {
    public DuplicateBarcodeException(String barcode) {
        super("A product already uses barcode: " + barcode);
    }
}
