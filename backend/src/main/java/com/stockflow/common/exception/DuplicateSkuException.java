package com.stockflow.common.exception;

public class DuplicateSkuException extends RuntimeException {
    public DuplicateSkuException(String sku) {
        super("A product already uses SKU: " + sku);
    }
}
