package com.stockflow.supplier.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @Size(max = 100)
    @Column(length = 100)
    private String contactPerson;

    @Size(max = 150)
    @Column(length = 150)
    private String email;

    @Size(max = 30)
    @Column(length = 30)
    private String phone;

    @Size(max = 255)
    @Column(length = 255)
    private String address;

    protected Supplier() {
    }

    public Supplier(String name, String contactPerson, String email, String phone, String address) {
        updateDetails(name, contactPerson, email, phone, address);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public void updateDetails(String name, String contactPerson, String email, String phone, String address) {
        this.name = normalizeRequired(name, "Supplier name is required");
        this.contactPerson = normalize(contactPerson);
        this.email = normalize(email);
        this.phone = normalize(phone);
        this.address = normalize(address);
    }

    private String normalize(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeRequired(String value, String message) {
        String normalized = normalize(value);
        if (normalized == null) {
            throw new IllegalArgumentException(message);
        }
        return normalized;
    }
}
