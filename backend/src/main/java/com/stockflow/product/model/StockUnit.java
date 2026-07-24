package com.stockflow.product.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StockUnit {
  UNIT("unit"),
  KILOGRAM("kilogram"),
  GRAM("gram"),
  LITER("liter"),
  METER("meter"),
  BOX("box"),
  PALLET("pallet"),
  CUSTOM("custom");

  private final String apiValue;

  StockUnit(String apiValue) {
    this.apiValue = apiValue;
  }

  @JsonValue
  public String getApiValue() {
    return this.apiValue;
  }

  @JsonCreator
  public static StockUnit fromValue(String value) {
    if (value == null) {
      return null;
    }

    for (StockUnit unit : StockUnit.values()) {
      if (unit.apiValue.equals(value)) {
        return unit;
      }
    }

    throw new IllegalArgumentException(
        "Unknown stock unit: " + value);
  }
}
