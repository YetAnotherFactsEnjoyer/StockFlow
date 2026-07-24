package com.stockflow.product.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.stockflow.product.dto.response.ProductCustomerResponse;
import com.stockflow.product.dto.response.ProductResponse;
import com.stockflow.product.dto.response.ProductSupplierResponse;
import com.stockflow.product.entity.Product;
import com.stockflow.product.entity.ProductCustomer;
import com.stockflow.product.entity.ProductInventory;
import com.stockflow.product.entity.ProductSupplier;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId().toString());
        response.setName(product.getName());
        response.setSku(product.getSku());
        response.setDescription(product.getDescription());
        response.setType(product.getType());
        response.setStockUnit(product.getStockUnit());
        response.setCustomStockUnit(product.getCustomStockUnit());
        response.setAvailability(product.getAvailability());
        response.setDefaultSellingPrice(product.getDefaultSellingPrice());
        response.setActive(product.isActive());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        ProductInventory inventory = product.getInventory();
        if (inventory != null) {
            response.setStockQuantity(inventory.getQuantity());
            response.setReorderLevel(inventory.getReorderLevel());
            response.setBarcode(inventory.getBarcode());
        }

        List<ProductSupplierResponse> suppliers = product.getSuppliers().stream()
                .map(this::toResponse)
                .toList();
        List<ProductCustomerResponse> customers = product.getCustomers().stream()
                .map(this::toResponse)
                .toList();
        response.setSuppliers(suppliers);
        response.setCustomers(customers);
        return response;
    }

    public ProductSupplierResponse toResponse(ProductSupplier link) {
        ProductSupplierResponse response = new ProductSupplierResponse();
        response.setId(link.getId().toString());
        response.setSupplierId(link.getSupplier().getId().toString());
        response.setSupplierSku(link.getSupplierSku());
        response.setPurchasePrice(link.getPurchasePrice());
        response.setMinimumOrderQuantity(link.getMinimumOrderQuantity());
        response.setLeadTimeDays(link.getLeadTimeDays());
        response.setPreferred(link.isPreferred());
        return response;
    }

    public ProductCustomerResponse toResponse(ProductCustomer link) {
        ProductCustomerResponse response = new ProductCustomerResponse();
        response.setId(link.getId().toString());
        response.setCustomerId(link.getCustomer().getId().toString());
        response.setCustomerSku(link.getCustomerSku());
        response.setSellingPrice(link.getSellingPrice());
        response.setMinimumOrderQuantity(link.getMinimumOrderQuantity());
        return response;
    }
}
