package com.stockflow.customer.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stockflow.customer.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
}
