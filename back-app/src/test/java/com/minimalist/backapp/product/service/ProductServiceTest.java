package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.AddProductDTO;
import com.minimalist.backapp.product.entity.product.Category;
import com.minimalist.backapp.product.entity.product.Product;
import com.minimalist.backapp.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Cadeira Minimalista");
        product.setMaterial("Madeira");
        product.setPrice(new BigDecimal("499.90"));
        product.setImageUrl("https://cdn.minimalist.com/cadeira.jpg");
        product.setCategory(Category.FURNITURE);
    }

    @Nested
    @DisplayName("allProduct()")
    class AllProduct {

        @Test
        @DisplayName("deve retornar lista com todos os produtos")
        void shouldReturnAllProducts() {
            when(productRepository.findAll()).thenReturn(List.of(product));

            List<Product> result = productService.allProduct();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("Cadeira Minimalista");
            verify(productRepository).findAll();
        }

        @Test
        @DisplayName("deve retornar lista vazia quando não há produtos")
        void shouldReturnEmptyListWhenNoProducts() {
            when(productRepository.findAll()).thenReturn(List.of());

            List<Product> result = productService.allProduct();

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("findProduct()")
    class FindProduct {

        @Test
        @DisplayName("deve retornar produto quando ID existe")
        void shouldReturnProductWhenExists() {
            when(productRepository.findById(1)).thenReturn(Optional.of(product));

            Product result = productService.findProduct(1);

            assertThat(result.getName()).isEqualTo("Cadeira Minimalista");
        }

        @Test
        @DisplayName("deve lançar RuntimeException quando ID não existe")
        void shouldThrowWhenProductNotFound() {
            when(productRepository.findById(99)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> productService.findProduct(99))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("Item não encontrado");
        }
    }

    @Nested
    @DisplayName("addProduct()")
    class AddProduct {

        @Test
        @DisplayName("deve salvar produto e retornar mensagem de sucesso")
        void shouldSaveProductAndReturnSuccessMessage() {
            AddProductDTO dto = new AddProductDTO(
                    "Mesa de Centro",
                    "Vidro",
                    new BigDecimal("899.00"),
                    "https://cdn.minimalist.com/mesa.jpg",
                    Category.FURNITURE
            );
            when(productRepository.save(any(Product.class))).thenReturn(product);

            String result = productService.addProduct(dto);

            assertThat(result).isEqualTo("Produto Criado com sucesso");
            verify(productRepository).save(any(Product.class));
        }

        @Test
        @DisplayName("deve mapear corretamente os campos do DTO para a entidade")
        void shouldMapDtoFieldsCorrectly() {
            AddProductDTO dto = new AddProductDTO(
                    "Luminária",
                    "Alumínio",
                    new BigDecimal("199.00"),
                    "https://cdn.minimalist.com/luminaria.jpg",
                    Category.LIGHTING
            );

            productService.addProduct(dto);

            verify(productRepository).save(argThat(p ->
                    p.getName().equals("Luminária") &&
                    p.getMaterial().equals("Alumínio") &&
                    p.getPrice().compareTo(new BigDecimal("199.00")) == 0
            ));
        }
    }

    @Nested
    @DisplayName("deleteProduct()")
    class DeleteProduct {

        @Test
        @DisplayName("deve deletar produto e retornar mensagem de sucesso")
        void shouldDeleteProductAndReturnSuccessMessage() {
            doNothing().when(productRepository).deleteById(1);

            String result = productService.deleteProduct(1);

            assertThat(result).isEqualTo("Produto deletado com sucesso");
            verify(productRepository).deleteById(1);
        }
    }
}
