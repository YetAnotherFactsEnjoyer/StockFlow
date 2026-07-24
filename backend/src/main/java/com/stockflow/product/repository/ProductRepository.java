package com.stockflow.product.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockflow.product.entity.Product;

public interface ProductRepository
    extends JpaRepository<Product, UUID> {

  boolean existsBySkuIgnoreCase(String sku);

  boolean existsBySkuIgnoreCaseAndIdNot(
      String sku,
      UUID productId);

  Optional<Product> findBySkuIgnoreCase(String sku);

  boolean existsByInventoryBarcode(String barcode);

  boolean existsByInventoryBarcodeAndIdNot(
      String barcode,
      UUID productId);
}
