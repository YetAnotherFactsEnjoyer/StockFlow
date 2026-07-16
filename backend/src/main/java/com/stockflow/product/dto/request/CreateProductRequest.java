package com.stockflow.product.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.ArrayList;

public class CreateProductRequest {

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

  public CreateProductRequest() {
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

  public void setDetails(ProductDetailsRequest details) {
    this.details = details;
  }

  public void setInventory(ProductInventoryRequest inventory) {
    this.inventory = inventory;
  }

  public void setSuppliers(List<ProductSupplierRequest> suppliers) {
    this.suppliers = suppliers;
  }

  public void setCommercial(ProductCommercialRequest commercial) {
    this.commercial = commercial;
  }
}
