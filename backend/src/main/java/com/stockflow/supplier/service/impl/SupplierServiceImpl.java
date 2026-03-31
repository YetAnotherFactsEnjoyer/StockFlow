package com.stockflow.supplier.service.impl;

import com.stockflow.supplier.dto.SupplierRequest;
import com.stockflow.supplier.dto.SupplierResponse;
import com.stockflow.supplier.entity.Supplier;
import com.stockflow.common.exception.SupplierNotFoundException;
import com.stockflow.supplier.mapper.SupplierMapper;
import com.stockflow.supplier.repository.SupplierRepository;
import com.stockflow.supplier.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers() {
        log.debug("Fetching all suppliers");

        return supplierRepository.findAll()
                .stream()
                .map(SupplierMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponse getSupplierById(Long id) {
        log.debug("Fetching supplier by id={}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new SupplierNotFoundException(id));

        return SupplierMapper.toResponse(supplier);
    }

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {
        log.info("Creating supplier with name={}", request.getName());

        Supplier supplier = SupplierMapper.toEntity(request);
        Supplier savedSupplier = supplierRepository.save(supplier);

        log.info("Created supplier with id={}", savedSupplier.getId());
        return SupplierMapper.toResponse(savedSupplier);
    }

    @Override
    public SupplierResponse updateSupplier(Long id, SupplierRequest request) {
        log.info("Updating supplier id={}", id);

        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new SupplierNotFoundException(id));

        existingSupplier.updateDetails(
                request.getName(),
                request.getContactPerson(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress()
        );

        Supplier savedSupplier = supplierRepository.save(existingSupplier);

        log.info("Updated supplier id={}", savedSupplier.getId());
        return SupplierMapper.toResponse(savedSupplier);
    }

    @Override
    public void deleteSupplier(Long id) {
        log.info("Deleting supplier id={}", id);

        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new SupplierNotFoundException(id));

        supplierRepository.delete(existingSupplier);

        log.info("Deleted supplier id={}", id);
    }
}
