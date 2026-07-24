package com.stockflow.common.exception;

import java.util.UUID;

public class SupplierNotFoundException extends RuntimeException {

    public SupplierNotFoundException(UUID supplierId) {
        super("Supplier not found with id: " + supplierId);
    }
}
