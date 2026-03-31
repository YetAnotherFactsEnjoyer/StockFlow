package com.stockflow.common.exception;

public class SupplierNotFoundException extends RuntimeException {

    public SupplierNotFoundException(Long supplierId) {
        super("Supplier not found with id: " + supplierId);
    }
}
