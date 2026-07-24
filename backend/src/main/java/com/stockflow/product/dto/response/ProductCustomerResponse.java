package com.stockflow.product.dto.response;

import java.math.BigDecimal;

public class ProductCustomerResponse {

  private String id;
  private String customerId;
  private String customerSku;
  private BigDecimal sellingPrice;
  private Integer minimumOrderQuantity;

  public ProductCustomerResponse() {
  }

  public String getId() {
    return this.id;
  }

  public String getCustomerId() {
    return this.customerId;
  }

  public String getCustomerSku() {
    return this.customerSku;
  }

  public BigDecimal getSellingPrice() {
    return this.sellingPrice;
  }

  public Integer getMinimumOrderQuantity() {
    return this.minimumOrderQuantity;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setCustomerId(String customerId) {
    this.customerId = customerId;
  }

  public void setCustomerSku(String customerSku) {
    this.customerSku = customerSku;
  }

  public void setSellingPrice(BigDecimal sellingPrice) {
    this.sellingPrice = sellingPrice;
  }

  public void setMinimumOrderQuantity(
      Integer minimumOrderQuantity) {
    this.minimumOrderQuantity = minimumOrderQuantity;
  }
}
