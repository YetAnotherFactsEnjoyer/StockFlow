package com.stockflow.product.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.stockflow.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
