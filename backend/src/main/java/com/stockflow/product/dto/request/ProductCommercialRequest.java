package com.stockflow.product.dto.request;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.stockflow.product.model.ProductAvailability;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class ProductCommercialRequest {

  @NotNull
  private ProductAvailability availability;

  @PositiveOrZero
  private BigDecimal defaultSellingPrice;

  @NotNull
  @Valid
  private List<ProductCustomerRequest> customers = new ArrayList<>();

  public ProductCommercialRequest() {
  }

  public ProductAvailability getAvailability() {
    return this.availability;
  }

  public BigDecimal getDefaultSellingPrice() {
    return this.defaultSellingPrice;
  }

  public List<ProductCustomerRequest> getCustomers() {
    return this.customers;
  }

  public void setAvailability(ProductAvailability availability) {
    this.availability = availability;
  }

  public void setDefaultSellingPrice(BigDecimal defaultSellingPrice) {
    this.defaultSellingPrice = defaultSellingPrice;
  }

  public void setCustomers(List<ProductCustomerRequest> customers) {
    this.customers = customers;
  }
}
