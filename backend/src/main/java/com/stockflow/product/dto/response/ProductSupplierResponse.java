package com.stockflow.product.dto.response;

import java.math.BigDecimal;

public class ProductSupplierResponse {

  private String id;
  private String supplierId;
  private String supplierSku;
  private BigDecimal purchasePrice;
  private Integer minimumOrderQuantity;
  private Integer leadTimeDays;
  private boolean preferred;

  public ProductSupplierResponse() {
  }

  public String getId() {
    return this.id;
  }

  public String getSupplierId() {
    return this.supplierId;
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

  public void setId(String id) {
    this.id = id;
  }

  public void setSupplierId(String supplierId) {
    this.supplierId = supplierId;
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
