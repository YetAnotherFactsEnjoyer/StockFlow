package com.stockflow.product.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProductAvailability {
  INTERNAL("internal"),
  ALL_CUSTOMERS("all_customers"),
  SELECTED_CUSTOMERS("selected_customers");

  private final String apiValue;

  ProductAvailability(String apiValue) {
    this.apiValue = apiValue;
  }

  @JsonValue
  public String getApiValue() {
    return this.apiValue;
  }

  @JsonCreator
  public static ProductAvailability fromValue(String value) {
    if (value == null) {
      return null;
    }

    for (ProductAvailability availability : ProductAvailability.values()) {
      if (availability.apiValue.equals(value)) {
        return availability;
      }
    }

    throw new IllegalArgumentException(
        "Unknown product availability: " + value);
  }
}
