package com.stockflow.product.entity;

import java.math.BigDecimal;
import java.util.UUID;
import com.stockflow.customer.entity.Customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "product_customers", uniqueConstraints = {
    @UniqueConstraint(name = "uk_product_customer", columnNames = {
        "product_id",
        "customer_id"
    })
})
public class ProductCustomer {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @Column(name = "customer_sku", length = 64)
  private String customerSku;

  @Column(name = "selling_price", precision = 19, scale = 4)
  private BigDecimal sellingPrice;

  @Column(name = "minimum_order_quantity")
  private Integer minimumOrderQuantity;

  public ProductCustomer() {
  }

  public UUID getId() {
    return this.id;
  }

  public Product getProduct() {
    return this.product;
  }

  public Customer getCustomer() {
    return this.customer;
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

  public void setProduct(Product product) {
    this.product = product;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
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
