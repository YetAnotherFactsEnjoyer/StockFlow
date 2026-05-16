package com.stockflow.product.mapper;

import com.stockflow.product.dto.ProductResponse;
import com.stockflow.product.entity.Product;
import com.stockflow.supplier.entity.Supplier;

public final class ProductMapper {
    private ProductMapper() {
    }

    public static ProductResponse toResponse(Product product) {
        Supplier supplier = product.getSupplier();
        
        Long supplierId = supplier != null ? supplier.getId() : null;
        String supplierName = supplier != null ? supplier.getName() : null;

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getSku(),
                product.getPrice(),
                product.getStockQuantity(),
                supplierId,
                supplierName,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
