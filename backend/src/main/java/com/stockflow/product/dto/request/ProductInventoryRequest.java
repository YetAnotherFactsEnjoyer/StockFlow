package com.stockflow.product.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class ProductInventoryRequest {

  @NotNull
  @PositiveOrZero
  private BigDecimal initialQuantity;

  @PositiveOrZero
  private BigDecimal reorderLevel;

  @Size(max = 128)
  private String barcode;

  public ProductInventoryRequest() {
  }

  public BigDecimal getInitialQuantity() {
    return this.initialQuantity;
  }

  public BigDecimal getReorderLevel() {
    return this.reorderLevel;
  }

  public String getBarcode() {
    return this.barcode;
  }

  public void setInitialQuantity(BigDecimal initialQuantity) {
    this.initialQuantity = initialQuantity;
  }

  public void setReorderLevel(BigDecimal reorderLevel) {
    this.reorderLevel = reorderLevel;
  }

  public void setBarcode(String barcode) {
    this.barcode = barcode;
  }
}
