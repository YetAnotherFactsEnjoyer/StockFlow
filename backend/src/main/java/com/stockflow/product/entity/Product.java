package com.stockflow.product.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.stockflow.product.model.ProductAvailability;
import com.stockflow.product.model.ProductType;
import com.stockflow.product.model.StockUnit;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(length = 64, unique = true)
  private String sku;

  @Column(length = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ProductType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "stock_unit", nullable = false)
  private StockUnit stockUnit;

  @Column(name = "custom_stock_unit", length = 40)
  private String customStockUnit;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ProductAvailability availability;

  @Column(name = "default_selling_price", precision = 19, scale = 4)
  private BigDecimal defaultSellingPrice;

  @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private ProductInventory inventory;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<ProductSupplier> suppliers = new ArrayList<>();

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<ProductCustomer> customers = new ArrayList<>();

  @Column(nullable = false)
  private boolean active = true;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  public Product() {
  }

  @PrePersist
  protected void beforeInsert() {
    Instant now = Instant.now();

    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  protected void beforeUpdate() {
    this.updatedAt = Instant.now();
  }

  public UUID getId() {
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

  public ProductAvailability getAvailability() {
    return this.availability;
  }

  public BigDecimal getDefaultSellingPrice() {
    return this.defaultSellingPrice;
  }

  public ProductInventory getInventory() {
    return this.inventory;
  }

  public List<ProductSupplier> getSuppliers() {
    return this.suppliers;
  }

  public List<ProductCustomer> getCustomers() {
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

  public void setCustomStockUnit(
      String customStockUnit) {
    this.customStockUnit = customStockUnit;
  }

  public void setAvailability(
      ProductAvailability availability) {
    this.availability = availability;
  }

  public void setDefaultSellingPrice(
      BigDecimal defaultSellingPrice) {
    this.defaultSellingPrice = defaultSellingPrice;
  }

  public void setInventory(
      ProductInventory inventory) {
    if (this.inventory == inventory) {
      return;
    }

    ProductInventory previousInventory = this.inventory;

    this.inventory = inventory;

    if (previousInventory != null
        && previousInventory.getProduct() == this) {
      previousInventory.setProduct(null);
    }

    if (inventory != null
        && inventory.getProduct() != this) {
      inventory.setProduct(this);
    }
  }

  public void addSupplier(
      ProductSupplier productSupplier) {
    if (productSupplier == null
        || this.suppliers.contains(productSupplier)) {
      return;
    }

    this.suppliers.add(productSupplier);
    productSupplier.setProduct(this);
  }

  public void removeSupplier(
      ProductSupplier productSupplier) {
    if (productSupplier == null) {
      return;
    }

    if (this.suppliers.remove(productSupplier)) {
      productSupplier.setProduct(null);
    }
  }

  public void clearSuppliers() {
    List<ProductSupplier> currentSuppliers = new ArrayList<>(this.suppliers);

    for (ProductSupplier productSupplier : currentSuppliers) {
      removeSupplier(productSupplier);
    }
  }

  public void addCustomer(
      ProductCustomer productCustomer) {
    if (productCustomer == null
        || this.customers.contains(productCustomer)) {
      return;
    }

    this.customers.add(productCustomer);
    productCustomer.setProduct(this);
  }

  public void removeCustomer(
      ProductCustomer productCustomer) {
    if (productCustomer == null) {
      return;
    }

    if (this.customers.remove(productCustomer)) {
      productCustomer.setProduct(null);
    }
  }

  public void clearCustomers() {
    List<ProductCustomer> currentCustomers = new ArrayList<>(this.customers);

    for (ProductCustomer productCustomer : currentCustomers) {
      removeCustomer(productCustomer);
    }
  }

  public void setActive(boolean active) {
    this.active = active;
  }
}
