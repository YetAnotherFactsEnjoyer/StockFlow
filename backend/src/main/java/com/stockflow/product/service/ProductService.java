package com.stockflow.product.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stockflow.common.exception.CustomerNotFoundException;
import com.stockflow.common.exception.DuplicateBarcodeException;
import com.stockflow.common.exception.DuplicateSkuException;
import com.stockflow.common.exception.InvalidProductConfigurationException;
import com.stockflow.common.exception.InvalidReferenceIdException;
import com.stockflow.common.exception.ProductNotFoundException;
import com.stockflow.common.exception.SupplierNotFoundException;
import com.stockflow.customer.entity.Customer;
import com.stockflow.customer.repository.CustomerRepository;
import com.stockflow.product.dto.request.CreateProductRequest;
import com.stockflow.product.dto.request.ProductCommercialRequest;
import com.stockflow.product.dto.request.ProductCustomerRequest;
import com.stockflow.product.dto.request.ProductDetailsRequest;
import com.stockflow.product.dto.request.ProductInventoryRequest;
import com.stockflow.product.dto.request.ProductSupplierRequest;
import com.stockflow.product.dto.request.UpdateProductRequest;
import com.stockflow.product.dto.response.ProductResponse;
import com.stockflow.product.entity.Product;
import com.stockflow.product.entity.ProductCustomer;
import com.stockflow.product.entity.ProductInventory;
import com.stockflow.product.entity.ProductSupplier;
import com.stockflow.product.mapper.ProductMapper;
import com.stockflow.product.model.ProductAvailability;
import com.stockflow.product.model.StockUnit;
import com.stockflow.product.repository.ProductRepository;
import com.stockflow.supplier.entity.Supplier;
import com.stockflow.supplier.repository.SupplierRepository;

@Service
public class ProductService {

  private final ProductRepository productRepository;
  private final SupplierRepository supplierRepository;
  private final CustomerRepository customerRepository;
  private final ProductMapper productMapper;

  public ProductService(
      ProductRepository productRepository,
      SupplierRepository supplierRepository,
      CustomerRepository customerRepository,
      ProductMapper productMapper) {
    this.productRepository = productRepository;
    this.supplierRepository = supplierRepository;
    this.customerRepository = customerRepository;
    this.productMapper = productMapper;
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> getAllProducts() {
    return productRepository.findAll().stream()
        .map(productMapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public ProductResponse getProductById(UUID id) {
    return productMapper.toResponse(findProductOrThrow(id));
  }

  @Transactional
  public ProductResponse createProduct(CreateProductRequest request) {
    validateRequest(
        request.getDetails(),
        request.getInventory(),
        request.getSuppliers(),
        request.getCommercial(),
        null);

    Product product = new Product();
    applyAggregate(
        product,
        request.getDetails(),
        request.getInventory(),
        request.getSuppliers(),
        request.getCommercial());
    product.setActive(true);

    return productMapper.toResponse(productRepository.save(product));
  }

  @Transactional
  public ProductResponse updateProduct(UUID id, UpdateProductRequest request) {
    Product product = findProductOrThrow(id);
    validateRequest(
        request.getDetails(),
        request.getInventory(),
        request.getSuppliers(),
        request.getCommercial(),
        id);

    applyAggregate(
        product,
        request.getDetails(),
        request.getInventory(),
        request.getSuppliers(),
        request.getCommercial());
    product.setActive(request.getActive());

    return productMapper.toResponse(productRepository.save(product));
  }

  @Transactional
  public void deleteProduct(UUID id) {
    productRepository.delete(findProductOrThrow(id));
  }

  private void applyAggregate(
      Product product,
      ProductDetailsRequest details,
      ProductInventoryRequest inventoryRequest,
      List<ProductSupplierRequest> supplierRequests,
      ProductCommercialRequest commercial) {
    product.setName(details.getName().trim());
    product.setSku(normalize(details.getSku()));
    product.setDescription(normalize(details.getDescription()));
    product.setType(details.getType());
    product.setStockUnit(details.getStockUnit());
    product.setCustomStockUnit(
        details.getStockUnit() == StockUnit.CUSTOM
            ? normalize(details.getCustomStockUnit())
            : null);
    product.setAvailability(commercial.getAvailability());
    product.setDefaultSellingPrice(commercial.getDefaultSellingPrice());

    applyInventory(product, inventoryRequest);
    applySuppliers(product, supplierRequests);
    applyCustomers(product, commercial.getCustomers());
  }

  private void applyInventory(
      Product product,
      ProductInventoryRequest request) {
    if (request == null) {
      product.setInventory(null);
      return;
    }

    ProductInventory inventory = product.getInventory();
    if (inventory == null) {
      inventory = new ProductInventory();
      product.setInventory(inventory);
    }
    inventory.setQuantity(request.getInitialQuantity());
    inventory.setReorderLevel(request.getReorderLevel());
    inventory.setBarcode(normalize(request.getBarcode()));
  }

  private void applySuppliers(
      Product product,
      List<ProductSupplierRequest> requests) {
    product.clearSuppliers();
    for (ProductSupplierRequest request : safeList(requests)) {
      UUID supplierId = parseReferenceId("supplier", request.getSupplierId());
      Supplier supplier = supplierRepository.findById(supplierId)
          .orElseThrow(() -> new SupplierNotFoundException(supplierId));

      ProductSupplier link = new ProductSupplier();
      link.setSupplier(supplier);
      link.setSupplierSku(normalize(request.getSupplierSku()));
      link.setPurchasePrice(request.getPurchasePrice());
      link.setMinimumOrderQuantity(request.getMinimumOrderQuantity());
      link.setLeadTimeDays(request.getLeadTimeDays());
      link.setPreferred(Boolean.TRUE.equals(request.getPreferred()));
      product.addSupplier(link);
    }
  }

  private void applyCustomers(
      Product product,
      List<ProductCustomerRequest> requests) {
    product.clearCustomers();
    for (ProductCustomerRequest request : safeList(requests)) {
      UUID customerId = parseReferenceId("customer", request.getCustomerId());
      Customer customer = customerRepository.findById(customerId)
          .orElseThrow(() -> new CustomerNotFoundException(customerId));

      ProductCustomer link = new ProductCustomer();
      link.setCustomer(customer);
      link.setCustomerSku(normalize(request.getCustomerSku()));
      link.setSellingPrice(request.getSellingPrice());
      link.setMinimumOrderQuantity(request.getMinimumOrderQuantity());
      product.addCustomer(link);
    }
  }

  private void validateRequest(
      ProductDetailsRequest details,
      ProductInventoryRequest inventory,
      List<ProductSupplierRequest> suppliers,
      ProductCommercialRequest commercial,
      UUID productId) {
    if (details == null || commercial == null) {
      throw new InvalidProductConfigurationException(
          "Product details and commercial configuration are required");
    }

    String customUnit = normalize(details.getCustomStockUnit());
    if (details.getStockUnit() == StockUnit.CUSTOM && customUnit == null) {
      throw new InvalidProductConfigurationException(
          "A custom stock unit is required when stockUnit is CUSTOM");
    }

    validateSku(normalize(details.getSku()), productId);
    validateBarcode(inventory == null ? null : normalize(inventory.getBarcode()), productId);
    validateSupplierLinks(suppliers);
    validateCustomerLinks(commercial);
  }

  private void validateSku(String sku, UUID productId) {
    if (sku == null) {
      return;
    }
    boolean duplicate = productId == null
        ? productRepository.existsBySkuIgnoreCase(sku)
        : productRepository.existsBySkuIgnoreCaseAndIdNot(sku, productId);
    if (duplicate) {
      throw new DuplicateSkuException(sku);
    }
  }

  private void validateBarcode(String barcode, UUID productId) {
    if (barcode == null) {
      return;
    }
    boolean duplicate = productId == null
        ? productRepository.existsByInventoryBarcode(barcode)
        : productRepository.existsByInventoryBarcodeAndIdNot(barcode, productId);
    if (duplicate) {
      throw new DuplicateBarcodeException(barcode);
    }
  }

  private void validateSupplierLinks(List<ProductSupplierRequest> requests) {
    Set<UUID> ids = new HashSet<>();
    int preferredCount = 0;
    for (ProductSupplierRequest request : safeList(requests)) {
      UUID id = parseReferenceId("supplier", request.getSupplierId());
      if (!ids.add(id)) {
        throw new InvalidProductConfigurationException(
            "A supplier may only be linked to a product once");
      }
      if (Boolean.TRUE.equals(request.getPreferred())) {
        preferredCount++;
      }
    }
    if (preferredCount > 1) {
      throw new InvalidProductConfigurationException(
          "Only one preferred supplier is allowed");
    }
  }

  private void validateCustomerLinks(ProductCommercialRequest commercial) {
    List<ProductCustomerRequest> customers = safeList(commercial.getCustomers());
    if (commercial.getAvailability() == ProductAvailability.SELECTED_CUSTOMERS
        && customers.isEmpty()) {
      throw new InvalidProductConfigurationException(
          "SELECTED_CUSTOMERS requires at least one customer");
    }
    if (commercial.getAvailability() == ProductAvailability.INTERNAL
        && !customers.isEmpty()) {
      throw new InvalidProductConfigurationException(
          "INTERNAL products cannot contain customer links");
    }

    Set<UUID> ids = new HashSet<>();
    for (ProductCustomerRequest request : customers) {
      UUID id = parseReferenceId("customer", request.getCustomerId());
      if (!ids.add(id)) {
        throw new InvalidProductConfigurationException(
            "A customer may only be linked to a product once");
      }
    }
  }

  private Product findProductOrThrow(UUID id) {
    return productRepository.findById(id)
        .orElseThrow(() -> new ProductNotFoundException(id));
  }

  private UUID parseReferenceId(String type, String value) {
    try {
      return UUID.fromString(value);
    } catch (IllegalArgumentException | NullPointerException exception) {
      throw new InvalidReferenceIdException(type, value);
    }
  }

  private String normalize(String value) {
    if (value == null) {
      return null;
    }
    String normalized = value.trim();
    return normalized.isEmpty() ? null : normalized;
  }

  private <T> List<T> safeList(List<T> values) {
    return values == null ? List.of() : values;
  }
}
