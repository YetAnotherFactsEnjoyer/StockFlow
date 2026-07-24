package com.stockflow.product.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ProductType {
  FINISHED_GOOD("finished_good"),
  RAW_MATERIAL("raw_material"),
  COMPONENT("component"),
  CONSUMABLE("consumable"),
  PACKAGING("packaging"),
  OTHER("other");

  private final String apiValue;

  ProductType(String apiValue) {
    this.apiValue = apiValue;
  }

  @JsonValue
  public String getApiValue() {
    return this.apiValue;
  }

  @JsonCreator
  public static ProductType fromValue(String value) {
    if (value == null) {
      return null;
    }

    for (ProductType type : ProductType.values()) {
      if (type.apiValue.equals(value)) {
        return type;
      }
    }

    throw new IllegalArgumentException(
        "Unknown product type: " + value);
  }
}
