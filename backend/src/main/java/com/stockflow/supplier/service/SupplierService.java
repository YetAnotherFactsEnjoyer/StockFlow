package com.stockflow.supplier.service;

import java.util.List;
import java.util.UUID;

import com.stockflow.supplier.dto.SupplierRequest;
import com.stockflow.supplier.dto.SupplierResponse;

public interface SupplierService {

    List<SupplierResponse> getAllSuppliers(String search);

    SupplierResponse getSupplierById(UUID id);

    SupplierResponse createSupplier(SupplierRequest request);

    SupplierResponse updateSupplier(UUID id, SupplierRequest request);

    void deleteSupplier(UUID id);
}
