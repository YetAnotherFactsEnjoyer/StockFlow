package com.stockflow.product.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockflow.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
        List<Product> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name,
            String sku,
            String description
    );
}
