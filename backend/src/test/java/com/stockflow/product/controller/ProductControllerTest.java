package com.stockflow.product.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.stockflow.common.exception.GlobalExceptionHandler;
import com.stockflow.product.dto.request.CreateProductRequest;
import com.stockflow.product.dto.response.ProductResponse;
import com.stockflow.product.service.ProductService;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService productService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new ProductController(productService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void returnsCreatedForValidRequest() throws Exception {
        when(productService.createProduct(any(CreateProductRequest.class)))
                .thenReturn(new ProductResponse());

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "details": {
                                    "name": "Scanner",
                                    "type": "finished_good",
                                    "stockUnit": "unit"
                                  },
                                  "suppliers": [],
                                  "commercial": {
                                    "availability": "all_customers",
                                    "customers": []
                                  }
                                }
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    void rejectsInvalidRequest() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnsNoContentForDelete() throws Exception {
        mockMvc.perform(delete("/api/products/{id}", java.util.UUID.randomUUID()))
                .andExpect(status().isNoContent());
    }
}
