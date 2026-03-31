package com.stockflow.supplier.mapper;

import com.stockflow.supplier.dto.SupplierRequest;
import com.stockflow.supplier.dto.SupplierResponse;
import com.stockflow.supplier.entity.Supplier;

public final class SupplierMapper {

    private SupplierMapper() {
    }

    public static Supplier toEntity(SupplierRequest request) {
        return new Supplier(
                request.getName(),
                request.getContactPerson(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress()
        );
    }

    public static SupplierResponse toResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactPerson(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress()
        );
    }
}
