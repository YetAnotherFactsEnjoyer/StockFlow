package com.stockflow.product.service;

import java.util.List;
import com.stockflow.product.dto.ProductDTO;
import com.stockflow.product.entity.Product;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product createProduct(ProductDTO dto);

    Product updateProduct(Long id, ProductDTO dto);

    void deleteProduct(Long id);
}
