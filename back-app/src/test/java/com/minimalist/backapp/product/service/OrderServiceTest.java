package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.OrderCheckoutRequestDTO;
import com.minimalist.backapp.product.common.DTO.OrderResponseDTO;
import com.minimalist.backapp.product.common.DTO.OrderSummaryResponseDTO;
import com.minimalist.backapp.product.entity.cart.Cart;
import com.minimalist.backapp.product.entity.cartItem.CartItem;
import com.minimalist.backapp.product.entity.order.Order;
import com.minimalist.backapp.product.entity.order.OrderStatus;
import com.minimalist.backapp.product.entity.product.Product;
import com.minimalist.backapp.product.repository.CartRepository;
import com.minimalist.backapp.product.repository.OrderRepository;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService")
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CartRepository cartRepository;
    @Mock private CartService cartService;

    @InjectMocks
    private OrderService orderService;

    private final String USER_EMAIL = "gabriel@minimalist.com";
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setName("Cadeira Minimalista");
        product.setPrice(new BigDecimal("499.90"));

        cart = new Cart(USER_EMAIL);
        cart.getItems().add(new CartItem(cart, product, 2));
    }

    @Nested
    @DisplayName("checkout()")
    class Checkout {

        @Test
        @DisplayName("deve criar pedido a partir do carrinho e limpar o carrinho")
        void shouldCreateOrderAndClearCart() {
            OrderCheckoutRequestDTO request = new OrderCheckoutRequestDTO("Rua das Flores, 10 - BH");
            Order savedOrder = buildOrder(1, OrderStatus.PENDING);

            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

            OrderResponseDTO result = orderService.checkout(USER_EMAIL, request);

            assertThat(result).isNotNull();
            assertThat(result.userEmail()).isEqualTo(USER_EMAIL);
            verify(cartService).clearCart(USER_EMAIL);
        }

        @Test
        @DisplayName("deve mapear itens do carrinho para itens do pedido")
        void shouldMapCartItemsToOrderItems() {
            OrderCheckoutRequestDTO request = new OrderCheckoutRequestDTO("Av. Paulista, 1000");
            Order savedOrder = buildOrder(1, OrderStatus.PENDING);

            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

            orderService.checkout(USER_EMAIL, request);

            verify(orderRepository).save(argThat(order ->
                    !order.getItems().isEmpty() &&
                    order.getShippingAddress().equals("Av. Paulista, 1000") &&
                    order.getUserEmail().equals(USER_EMAIL)
            ));
        }

        @Test
        @DisplayName("deve lançar IllegalStateException quando carrinho não encontrado")
        void shouldThrowWhenCartNotFound() {
            OrderCheckoutRequestDTO request = new OrderCheckoutRequestDTO("Endereço X");
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.checkout(USER_EMAIL, request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Carrinho não encontrado");
        }

        @Test
        @DisplayName("deve lançar IllegalStateException quando carrinho está vazio")
        void shouldThrowWhenCartIsEmpty() {
            Cart emptyCart = new Cart(USER_EMAIL);
            OrderCheckoutRequestDTO request = new OrderCheckoutRequestDTO("Endereço X");

            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(emptyCart));

            assertThatThrownBy(() -> orderService.checkout(USER_EMAIL, request))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Carrinho está vazio");
        }

        @Test
        @DisplayName("não deve limpar o carrinho se o save lançar exceção")
        void shouldNotClearCartWhenSaveFails() {
            OrderCheckoutRequestDTO request = new OrderCheckoutRequestDTO("Endereço X");
            when(cartRepository.findByUserEmail(USER_EMAIL)).thenReturn(Optional.of(cart));
            when(orderRepository.save(any())).thenThrow(new RuntimeException("DB error"));

            assertThatThrownBy(() -> orderService.checkout(USER_EMAIL, request))
                    .isInstanceOf(RuntimeException.class);

            verify(cartService, never()).clearCart(any());
        }
    }

    @Nested
    @DisplayName("listOrders()")
    class ListOrders {

        @Test
        @DisplayName("deve retornar lista de resumos de pedidos do usuário")
        void shouldReturnOrderSummaries() {
            List<Order> orders = List.of(
                    buildOrder(1, OrderStatus.PENDING),
                    buildOrder(2, OrderStatus.CANCELLED)
            );
            when(orderRepository.findByUserEmailOrderByCreatedAtDesc(USER_EMAIL))
                    .thenReturn(orders);

            List<OrderSummaryResponseDTO> result = orderService.listOrders(USER_EMAIL);

            assertThat(result).hasSize(2);
            assertThat(result.get(0).status()).isEqualTo(OrderStatus.PENDING);
            assertThat(result.get(1).status()).isEqualTo(OrderStatus.CANCELLED);
        }

        @Test
        @DisplayName("deve retornar lista vazia quando usuário não tem pedidos")
        void shouldReturnEmptyListWhenNoPedidos() {
            when(orderRepository.findByUserEmailOrderByCreatedAtDesc(USER_EMAIL))
                    .thenReturn(List.of());

            assertThat(orderService.listOrders(USER_EMAIL)).isEmpty();
        }
    }

    @Nested
    @DisplayName("getOrder()")
    class GetOrder {

        @Test
        @DisplayName("deve retornar pedido quando ID e email coincidem")
        void shouldReturnOrderWhenFound() {
            Order order = buildOrder(1, OrderStatus.PENDING);
            when(orderRepository.findByIdAndUserEmail(1, USER_EMAIL))
                    .thenReturn(Optional.of(order));

            OrderResponseDTO result = orderService.getOrder(USER_EMAIL, 1);

            assertThat(result.id()).isEqualTo(1);
            assertThat(result.status()).isEqualTo(OrderStatus.PENDING);
        }

        @Test
        @DisplayName("deve lançar EntityNotFoundException quando pedido não pertence ao usuário")
        void shouldThrowWhenOrderNotFound() {
            when(orderRepository.findByIdAndUserEmail(99, USER_EMAIL))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.getOrder(USER_EMAIL, 99))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("cancelOrder()")
    class CancelOrder {

        @Test
        @DisplayName("deve cancelar pedido com status PENDING")
        void shouldCancelPendingOrder() {
            Order order = buildOrder(1, OrderStatus.PENDING);
            when(orderRepository.findByIdAndUserEmail(1, USER_EMAIL))
                    .thenReturn(Optional.of(order));
            when(orderRepository.save(order)).thenReturn(order);

            OrderResponseDTO result = orderService.cancelOrder(USER_EMAIL, 1);

            assertThat(result.status()).isEqualTo(OrderStatus.CANCELLED);
            verify(orderRepository).save(argThat(o -> o.getStatus() == OrderStatus.CANCELLED));
        }

        @Test
        @DisplayName("deve lançar IllegalStateException ao tentar cancelar pedido já cancelado")
        void shouldThrowWhenOrderAlreadyCancelled() {
            Order order = buildOrder(1, OrderStatus.CANCELLED);
            when(orderRepository.findByIdAndUserEmail(1, USER_EMAIL))
                    .thenReturn(Optional.of(order));

            assertThatThrownBy(() -> orderService.cancelOrder(USER_EMAIL, 1))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("PENDING");
        }

        @Test
        @DisplayName("deve lançar IllegalStateException ao tentar cancelar pedido com outro status")
        void shouldThrowWhenOrderIsNotPending() {
            Order shippedOrder = buildOrder(2, OrderStatus.SHIPPED);
            when(orderRepository.findByIdAndUserEmail(2, USER_EMAIL))
                    .thenReturn(Optional.of(shippedOrder));

            assertThatThrownBy(() -> orderService.cancelOrder(USER_EMAIL, 2))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("PENDING");
        }

        @Test
        @DisplayName("deve lançar EntityNotFoundException quando pedido não encontrado")
        void shouldThrowWhenOrderNotFound() {
            when(orderRepository.findByIdAndUserEmail(99, USER_EMAIL))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.cancelOrder(USER_EMAIL, 99))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }


    private Order buildOrder(Integer id, OrderStatus status) {
        Order order = new Order();
        order.setUserEmail(USER_EMAIL);
        order.setStatus(status);
        order.setTotal(new BigDecimal("999.80"));
        order.setShippingAddress("Rua das Flores, 10");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        // Simula ID via reflection (evita dependência de banco)
        try {
            var field = Order.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(order, id);
        } catch (Exception ignored) {}
        return order;
    }
}
