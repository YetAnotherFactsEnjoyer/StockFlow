package com.stockflow.product.dto.request;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class UpdateProductRequest {

  @NotNull
  @Valid
  private ProductDetailsRequest details;

  @Valid
  private ProductInventoryRequest inventory;

  @NotNull
  @Valid
  private List<ProductSupplierRequest> suppliers = new ArrayList<>();

  @Valid
  private ProductCommercialRequest commercial;

  @NotNull
  private Boolean active;

  public UpdateProductRequest() {
  }

  public ProductDetailsRequest getDetails() {
    return this.details;
  }

  public ProductInventoryRequest getInventory() {
    return this.inventory;
  }

  public List<ProductSupplierRequest> getSuppliers() {
    return this.suppliers;
  }

  public ProductCommercialRequest getCommercial() {
    return this.commercial;
  }

  public Boolean getActive() {
    return this.active;
  }

  public void setDetails(ProductDetailsRequest details) {
    this.details = details;
  }

  public void setInventory(ProductInventoryRequest inventory) {
    this.inventory = inventory;
  }

  public void setSuppliers(
      List<ProductSupplierRequest> suppliers) {
    this.suppliers = suppliers;
  }

  public void setCommercial(
      ProductCommercialRequest commercial) {
    this.commercial = commercial;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }
}
