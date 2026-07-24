package com.stockflow.product.entity;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_inventories")
public class ProductInventory {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @OneToOne(optional = false)
  @JoinColumn(name = "product_id", nullable = false, unique = true)
  private Product product;

  @Column(nullable = false, precision = 19, scale = 4)
  private BigDecimal quantity;

  @Column(name = "reorder_level", precision = 19, scale = 4)
  private BigDecimal reorderLevel;

  @Column(length = 128, unique = true)
  private String barcode;

  public ProductInventory() {
  }

  public UUID getId() {
    return this.id;
  }

  public Product getProduct() {
    return this.product;
  }

  public BigDecimal getQuantity() {
    return this.quantity;
  }

  public BigDecimal getReorderLevel() {
    return this.reorderLevel;
  }

  public String getBarcode() {
    return this.barcode;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public void setQuantity(BigDecimal quantity) {
    this.quantity = quantity;
  }

  public void setReorderLevel(BigDecimal reorderLevel) {
    this.reorderLevel = reorderLevel;
  }

  public void setBarcode(String barcode) {
    this.barcode = barcode;
  }
}
