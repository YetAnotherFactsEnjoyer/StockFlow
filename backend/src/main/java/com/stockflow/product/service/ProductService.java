package com.stockflow.product.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.stockflow.product.dto.ProductRequest;
import com.stockflow.product.dto.ProductResponse;
import com.stockflow.product.entity.Product;
import com.stockflow.product.mapper.ProductMapper;
import com.stockflow.product.repository.ProductRepository;
import com.stockflow.supplier.entity.Supplier;
import com.stockflow.supplier.repository.SupplierRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public ProductService(
            ProductRepository productRepository,
            SupplierRepository supplierRepository
    ) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    public List<ProductResponse> getAllProducts(String search) {
        List<Product> products;
        if (search == null || search.isBlank()) {
            products = productRepository.findAll();
        } else {
            products = productRepository
                    .findByNameContainingIgnoreCaseOrSkuContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                            search,
                            search,
                            search
                    );
        }

        return products.stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = findProductOrThrow(id);
        return ProductMapper.toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Supplier supplier = findSupplierOrThrow(request.getSupplierId());

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getSku(),
                request.getPrice(),
                request.getStockQuantity(),
                supplier
        );

        Product savedProduct = productRepository.save(product);
        return ProductMapper.toResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product existingProduct = findProductOrThrow(id);
        Supplier supplier = findSupplierOrThrow(request.getSupplierId());

        existingProduct.updateDetails(
                request.getName(),
                request.getDescription(),
                request.getSku(),
                request.getPrice(),
                request.getStockQuantity(),
                supplier
        );

        Product savedProduct = productRepository.save(existingProduct);
        return ProductMapper.toResponse(savedProduct);
    }

    public void deleteProduct(Long id) {
        Product existingProduct = findProductOrThrow(id);
        productRepository.delete(existingProduct);
    }

    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    private Supplier findSupplierOrThrow(Long supplierId) {
        return supplierRepository.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
    }
}
