package com.stockflow.product.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import com.stockflow.product.dto.ProductDTO;
import com.stockflow.product.entity.Product;
import com.stockflow.product.repository.ProductRepository;
import com.stockflow.product.service.ProductService;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return this.productRepository.findAll(); 
    }

    @Override
    public Product getProductById(Long id) {
        return this.productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Product not found with id : " + id));
    }

    @Override
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

    @Override
    public Product updateProduct(Long id, ProductDTO dto) {
        Product product = getProductById(id);
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        return this.productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!this.productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        this.productRepository.deleteById(id);
    }
}
