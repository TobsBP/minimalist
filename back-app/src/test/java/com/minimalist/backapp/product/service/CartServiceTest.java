package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.*;
import com.minimalist.backapp.product.entity.cart.Cart;
import com.minimalist.backapp.product.entity.cartItem.CartItem;
import com.minimalist.backapp.product.entity.product.Product;
import com.minimalist.backapp.product.repository.CartItemRepository;
import com.minimalist.backapp.product.repository.CartRepository;
import com.minimalist.backapp.product.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CartService")
class CartServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private Cart cart;
    private Product product;
    private final String USER_EMAIL = "gabriel@minimalist.com";

    @BeforeEach
    void setUp() {
        cart = new Cart(USER_EMAIL);

        product = new Product();
        product.setName("Cadeira");
        product.setPrice(new BigDecimal("499.90"));
        product.setImageUrl("https://cdn.minimalist.com/cadeira.jpg");
    }

    @Nested
    @DisplayName("getCart()")
    class GetCart {

        @Test
        @DisplayName("deve retornar carrinho existente do usuário")
        void shouldReturnExistingCart() {
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));

            CartResponseDTO result = cartService.getCart(USER_EMAIL);

            assertThat(result.userEmail()).isEqualTo(USER_EMAIL);
            assertThat(result.items()).isEmpty();
            verify(cartRepository, never()).save(any());
        }

        @Test
        @DisplayName("deve criar e retornar novo carrinho quando usuário não tem carrinho")
        void shouldCreateCartWhenNotExists() {
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.empty());
            when(cartRepository.save(any(Cart.class))).thenReturn(cart);

            CartResponseDTO result = cartService.getCart(USER_EMAIL);

            assertThat(result.userEmail()).isEqualTo(USER_EMAIL);
            verify(cartRepository).save(any(Cart.class));
        }
    }

    @Nested
    @DisplayName("addItem()")
    class AddItem {

        @Test
        @DisplayName("deve adicionar novo item ao carrinho")
        void shouldAddNewItemToCart() {
            CartAddItemRequestDTO request = new CartAddItemRequestDTO(1, 2);
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(productRepository.findById(1)).thenReturn(Optional.of(product));
            when(cartItemRepository.findByCartIdAndProductId(any(), eq(product.getId())))
                    .thenReturn(Optional.empty());
            when(cartRepository.save(cart)).thenReturn(cart);

            CartResponseDTO result = cartService.addItem(USER_EMAIL, request);

            assertThat(result).isNotNull();
            verify(cartRepository).save(cart);
        }

        @Test
        @DisplayName("deve incrementar quantidade quando item já existe no carrinho")
        void shouldIncrementQuantityWhenItemAlreadyInCart() {
            CartItem existingItem = new CartItem(cart, product, 1);
            CartAddItemRequestDTO request = new CartAddItemRequestDTO(1, 3);

            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(productRepository.findById(1)).thenReturn(Optional.of(product));
            when(cartItemRepository.findByCartIdAndProductId(any(), eq(product.getId())))
                    .thenReturn(Optional.of(existingItem));
            when(cartRepository.save(cart)).thenReturn(cart);

            cartService.addItem(USER_EMAIL, request);

            assertThat(existingItem.getQuantity()).isEqualTo(4);
        }

        @Test
        @DisplayName("deve lançar EntityNotFoundException quando produto não existe")
        void shouldThrowWhenProductNotFound() {
            CartAddItemRequestDTO request = new CartAddItemRequestDTO(99, 1);
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(productRepository.findById(99)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cartService.addItem(USER_EMAIL, request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("updateItem()")
    class UpdateItem {

        @Test
        @DisplayName("deve lançar EntityNotFoundException quando item não pertence ao carrinho")
        void shouldThrowWhenItemDoesNotBelongToCart() {
            CartUpdateItemRequestDTO request = new CartUpdateItemRequestDTO(5);
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(cartItemRepository.findById(999)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cartService.updateItem(USER_EMAIL, 999, request))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("999");
        }
    }

    @Nested
    @DisplayName("removeItem()")
    class RemoveItem {

        @Test
        @DisplayName("deve lançar EntityNotFoundException quando item não encontrado")
        void shouldThrowWhenItemNotFound() {
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(cartItemRepository.findById(55)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cartService.removeItem(USER_EMAIL, 55))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("55");
        }
    }

    @Nested
    @DisplayName("clearCart()")
    class ClearCart {

        @Test
        @DisplayName("deve limpar todos os itens do carrinho")
        void shouldClearAllItemsFromCart() {
            cart.getItems().add(new CartItem(cart, product, 3));
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(cartRepository.save(cart)).thenReturn(cart);

            cartService.clearCart(USER_EMAIL);

            assertThat(cart.getItems()).isEmpty();
            verify(cartRepository).save(cart);
        }

        @Test
        @DisplayName("deve funcionar mesmo com carrinho já vazio")
        void shouldWorkOnEmptyCart() {
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(cartRepository.save(cart)).thenReturn(cart);

            assertThatCode(() -> cartService.clearCart(USER_EMAIL)).doesNotThrowAnyException();
        }
    }
}
