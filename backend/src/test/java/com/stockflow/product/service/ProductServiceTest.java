package com.stockflow.product.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stockflow.common.exception.DuplicateSkuException;
import com.stockflow.common.exception.InvalidProductConfigurationException;
import com.stockflow.common.exception.SupplierNotFoundException;
import com.stockflow.customer.repository.CustomerRepository;
import com.stockflow.product.dto.request.CreateProductRequest;
import com.stockflow.product.dto.request.ProductCommercialRequest;
import com.stockflow.product.dto.request.ProductDetailsRequest;
import com.stockflow.product.dto.request.ProductInventoryRequest;
import com.stockflow.product.dto.request.ProductSupplierRequest;
import com.stockflow.product.dto.request.UpdateProductRequest;
import com.stockflow.product.dto.response.ProductResponse;
import com.stockflow.product.entity.Product;
import com.stockflow.product.entity.ProductSupplier;
import com.stockflow.product.mapper.ProductMapper;
import com.stockflow.product.model.ProductAvailability;
import com.stockflow.product.model.ProductType;
import com.stockflow.product.model.StockUnit;
import com.stockflow.product.repository.ProductRepository;
import com.stockflow.supplier.repository.SupplierRepository;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private SupplierRepository supplierRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private ProductMapper productMapper;

    private ProductService service;
    private ProductResponse mappedResponse;

    @BeforeEach
    void setUp() {
        service = new ProductService(
                productRepository,
                supplierRepository,
                customerRepository,
                productMapper);
        mappedResponse = new ProductResponse();
        lenient().when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        lenient().when(productMapper.toResponse(any(Product.class))).thenReturn(mappedResponse);
    }

    @Test
    void createsProductWithoutInventory() {
        service.createProduct(validRequest());

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        Product product = captor.getValue();
        assertEquals("Wireless Scanner", product.getName());
        assertNull(product.getInventory());
        assertTrue(product.isActive());
    }

    @Test
    void createsProductWithInventory() {
        CreateProductRequest request = validRequest();
        ProductInventoryRequest inventory = new ProductInventoryRequest();
        inventory.setInitialQuantity(new BigDecimal("12.5"));
        inventory.setReorderLevel(new BigDecimal("3"));
        inventory.setBarcode(" CODE-1 ");
        request.setInventory(inventory);

        service.createProduct(request);

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        assertEquals(new BigDecimal("12.5"), captor.getValue().getInventory().getQuantity());
        assertEquals("CODE-1", captor.getValue().getInventory().getBarcode());
    }

    @Test
    void rejectsDuplicateSku() {
        when(productRepository.existsBySkuIgnoreCase("SCAN-1")).thenReturn(true);
        assertThrows(DuplicateSkuException.class,
                () -> service.createProduct(validRequest()));
    }

    @Test
    void rejectsUnknownSupplier() {
        UUID supplierId = UUID.randomUUID();
        CreateProductRequest request = validRequest();
        request.setSuppliers(List.of(supplierRequest(supplierId, true)));
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.empty());

        assertThrows(SupplierNotFoundException.class,
                () -> service.createProduct(request));
    }

    @Test
    void rejectsDuplicateSupplierLinks() {
        UUID supplierId = UUID.randomUUID();
        CreateProductRequest request = validRequest();
        request.setSuppliers(List.of(
                supplierRequest(supplierId, false),
                supplierRequest(supplierId, false)));

        assertThrows(InvalidProductConfigurationException.class,
                () -> service.createProduct(request));
    }

    @Test
    void rejectsMultiplePreferredSuppliers() {
        CreateProductRequest request = validRequest();
        request.setSuppliers(List.of(
                supplierRequest(UUID.randomUUID(), true),
                supplierRequest(UUID.randomUUID(), true)));

        assertThrows(InvalidProductConfigurationException.class,
                () -> service.createProduct(request));
    }

    @Test
    void rejectsCustomUnitWithoutName() {
        CreateProductRequest request = validRequest();
        request.getDetails().setStockUnit(StockUnit.CUSTOM);

        assertThrows(InvalidProductConfigurationException.class,
                () -> service.createProduct(request));
    }

    @Test
    void rejectsSelectedCustomersWithoutLinks() {
        CreateProductRequest request = validRequest();
        request.getCommercial().setAvailability(ProductAvailability.SELECTED_CUSTOMERS);

        assertThrows(InvalidProductConfigurationException.class,
                () -> service.createProduct(request));
    }

    @Test
    void updateReplacesNestedRelationships() {
        UUID productId = UUID.randomUUID();
        Product product = new Product();
        product.addSupplier(new ProductSupplier());
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        UpdateProductRequest request = validUpdateRequest();
        service.updateProduct(productId, request);

        assertTrue(product.getSuppliers().isEmpty());
        assertNull(product.getInventory());
        assertEquals(false, product.isActive());
    }

    @Test
    void deleteRemovesAggregateRoot() {
        UUID productId = UUID.randomUUID();
        Product product = new Product();
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        service.deleteProduct(productId);

        verify(productRepository).delete(product);
    }

    private CreateProductRequest validRequest() {
        ProductDetailsRequest details = new ProductDetailsRequest();
        details.setName(" Wireless Scanner ");
        details.setSku("SCAN-1");
        details.setType(ProductType.FINISHED_GOOD);
        details.setStockUnit(StockUnit.UNIT);

        ProductCommercialRequest commercial = new ProductCommercialRequest();
        commercial.setAvailability(ProductAvailability.ALL_CUSTOMERS);

        CreateProductRequest request = new CreateProductRequest();
        request.setDetails(details);
        request.setCommercial(commercial);
        request.setSuppliers(List.of());
        return request;
    }

    private ProductSupplierRequest supplierRequest(UUID id, boolean preferred) {
        ProductSupplierRequest request = new ProductSupplierRequest();
        request.setSupplierId(id.toString());
        request.setPreferred(preferred);
        return request;
    }

    private UpdateProductRequest validUpdateRequest() {
        CreateProductRequest createRequest = validRequest();
        UpdateProductRequest updateRequest = new UpdateProductRequest();
        updateRequest.setDetails(createRequest.getDetails());
        updateRequest.setCommercial(createRequest.getCommercial());
        updateRequest.setSuppliers(List.of());
        updateRequest.setActive(false);
        return updateRequest;
    }
}
