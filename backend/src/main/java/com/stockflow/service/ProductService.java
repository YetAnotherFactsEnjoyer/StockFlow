package com.stockflow.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.stockflow.dto.ProductDTO;
import com.stockflow.entity.Product;
import com.stockflow.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return this.productRepository.findAll(); 
    }

    public Product getProductById(Long id) {
        return this.productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id : " + id));
    }

    public Product createProduct(ProductDTO dto) {
        if (this.productRepository.existsBySku(dto.getSku())) {
            throw new IllegalArgumentException("SKU already exists : " + dto.getSku());
        }
        Product product = new Product();
        product.setName(dto.getName()); 
        product.setDescription(dto.getDescription());
        product.setSku(dto.getSku());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        return this.productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductDTO dto) {
        Product product = getProductById(id);
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        return this.productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!this.productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        this.productRepository.deleteById(id);
    }
}
