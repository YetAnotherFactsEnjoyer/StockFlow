package com.stockflow.product.dto.request;

import com.stockflow.product.model.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProductDetailsRequest {

  @NotBlank
  @Size(max = 120)
  private String name;

  @Size(max = 64)
  private String sku;

  @Size(max = 500)
  private String description;

  @NotNull
  private ProductType type;

  @NotNull
  private StockUnit stockUnit;

  @Size(max = 40)
  private String customStockUnit;

  public ProductDetailsRequest() {
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
}
