package com.stockflow.product.entity;

import java.math.BigDecimal;
import java.util.UUID;

import com.stockflow.supplier.entity.Supplier;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "product_suppliers", uniqueConstraints = {
    @UniqueConstraint(name = "uk_product_supplier", columnNames = {
        "product_id",
        "supplier_id"
    })
})
public class ProductSupplier {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "supplier_id", nullable = false)
  private Supplier supplier;

  @Column(name = "supplier_sku", length = 64)
  private String supplierSku;

  @Column(name = "purchase_price", precision = 19, scale = 4)
  private BigDecimal purchasePrice;

  @Column(name = "minimum_order_quantity")
  private Integer minimumOrderQuantity;

  @Column(name = "lead_time_days")
  private Integer leadTimeDays;

  @Column(nullable = false)
  private boolean preferred;

  public ProductSupplier() {
  }

  public UUID getId() {
    return this.id;
  }

  public Product getProduct() {
    return this.product;
  }

  public Supplier getSupplier() {
    return this.supplier;
  }

  public String getSupplierSku() {
    return this.supplierSku;
  }

  public BigDecimal getPurchasePrice() {
    return this.purchasePrice;
  }

  public Integer getMinimumOrderQuantity() {
    return this.minimumOrderQuantity;
  }

  public Integer getLeadTimeDays() {
    return this.leadTimeDays;
  }

  public boolean isPreferred() {
    return this.preferred;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public void setSupplier(Supplier supplier) {
    this.supplier = supplier;
  }

  public void setSupplierSku(String supplierSku) {
    this.supplierSku = supplierSku;
  }

  public void setPurchasePrice(BigDecimal purchasePrice) {
    this.purchasePrice = purchasePrice;
  }

  public void setMinimumOrderQuantity(
      Integer minimumOrderQuantity) {
    this.minimumOrderQuantity = minimumOrderQuantity;
  }

  public void setLeadTimeDays(Integer leadTimeDays) {
    this.leadTimeDays = leadTimeDays;
  }

  public void setPreferred(boolean preferred) {
    this.preferred = preferred;
  }
}
