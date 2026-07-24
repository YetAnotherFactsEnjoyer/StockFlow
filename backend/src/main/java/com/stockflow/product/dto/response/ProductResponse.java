package com.stockflow.product.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.stockflow.product.model.ProductAvailability;
import com.stockflow.product.model.ProductType;
import com.stockflow.product.model.StockUnit;

public class ProductResponse {

  private String id;

  private String name;
  private String sku;
  private String description;

  private ProductType type;
  private StockUnit stockUnit;
  private String customStockUnit;

  private BigDecimal stockQuantity;
  private BigDecimal reorderLevel;
  private String barcode;

  private ProductAvailability availability;
  private BigDecimal defaultSellingPrice;

  private List<ProductSupplierResponse> suppliers = new ArrayList<>();

  private List<ProductCustomerResponse> customers = new ArrayList<>();

  private boolean active;

  private Instant createdAt;
  private Instant updatedAt;

  public ProductResponse() {
  }

  public String getId() {
    return this.id;
  }

  public String getName() {
    return this.name;
  }

  public String getSku() {
    return this.sku;
  }

  public String getDescription() {
    return this.description;
  }

  public ProductType getType() {
    return this.type;
  }

  public StockUnit getStockUnit() {
    return this.stockUnit;
  }

  public String getCustomStockUnit() {
    return this.customStockUnit;
  }

  public BigDecimal getStockQuantity() {
    return this.stockQuantity;
  }

  public BigDecimal getReorderLevel() {
    return this.reorderLevel;
  }

  public String getBarcode() {
    return this.barcode;
  }

  public ProductAvailability getAvailability() {
    return this.availability;
  }

  public BigDecimal getDefaultSellingPrice() {
    return this.defaultSellingPrice;
  }

  public List<ProductSupplierResponse> getSuppliers() {
    return this.suppliers;
  }

  public List<ProductCustomerResponse> getCustomers() {
    return this.customers;
  }

  public boolean isActive() {
    return this.active;
  }

  public Instant getCreatedAt() {
    return this.createdAt;
  }

  public Instant getUpdatedAt() {
    return this.updatedAt;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setSku(String sku) {
    this.sku = sku;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setType(ProductType type) {
    this.type = type;
  }

  public void setStockUnit(StockUnit stockUnit) {
    this.stockUnit = stockUnit;
  }

  public void setCustomStockUnit(String customStockUnit) {
    this.customStockUnit = customStockUnit;
  }

  public void setStockQuantity(BigDecimal stockQuantity) {
    this.stockQuantity = stockQuantity;
  }

  public void setReorderLevel(BigDecimal reorderLevel) {
    this.reorderLevel = reorderLevel;
  }

  public void setBarcode(String barcode) {
    this.barcode = barcode;
  }

  public void setAvailability(
      ProductAvailability availability) {
    this.availability = availability;
  }

  public void setDefaultSellingPrice(
      BigDecimal defaultSellingPrice) {
    this.defaultSellingPrice = defaultSellingPrice;
  }

  public void setSuppliers(
      List<ProductSupplierResponse> suppliers) {
    this.suppliers = suppliers;
  }

  public void setCustomers(
      List<ProductCustomerResponse> customers) {
    this.customers = customers;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}
