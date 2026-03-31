package com.stockflow.supplier.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.stockflow.supplier.entity.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
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
}
