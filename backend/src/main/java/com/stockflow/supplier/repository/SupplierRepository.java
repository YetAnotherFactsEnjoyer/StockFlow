package com.stockflow.supplier.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stockflow.supplier.entity.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    Optional<Supplier> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<Supplier> findByName(String name);
    boolean existsByName(String name);

    Optional<Supplier> findByContactPerson(String contactPerson);
    boolean existsByContactPerson(String contactPerson);

    Optional<Supplier> findByPhone(String phone);
    boolean existsByPhone(String phone);

    Optional<Supplier> findByAddress(String address);
    boolean existsByAddress(String address);

    List<Supplier> findByNameContainingIgnoreCaseOrContactPersonContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrAddressContainingIgnoreCase(
            String name,
            String contactPerson,
            String email,
            String phone,
            String address
    );
}
