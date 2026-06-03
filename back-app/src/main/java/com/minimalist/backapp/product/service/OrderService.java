package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.OrderCheckoutRequestDTO;
import com.minimalist.backapp.product.common.DTO.OrderItemResponseDTO;
import com.minimalist.backapp.product.common.DTO.OrderResponseDTO;
import com.minimalist.backapp.product.common.DTO.OrderSummaryResponseDTO;
import com.minimalist.backapp.product.entity.cart.Cart;
import com.minimalist.backapp.product.entity.order.Order;
import com.minimalist.backapp.product.entity.order.OrderStatus;
import com.minimalist.backapp.product.entity.orderItem.OrderItem;
import com.minimalist.backapp.product.repository.CartRepository;
import com.minimalist.backapp.product.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        CartService cartService) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartService = cartService;
    }

    @Transactional
    public OrderResponseDTO checkout(String userEmail, OrderCheckoutRequestDTO request) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("Carrinho não encontrado para o usuário: " + userEmail));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Carrinho está vazio");
        }

        Order order = new Order();
        order.setUserEmail(userEmail);
        order.setShippingAddress(request.shippingAddress());
        order.setTotal(cart.getTotal());

        cart.getItems().forEach(cartItem -> {
            OrderItem orderItem = new OrderItem(
                    order,
                    cartItem.getProduct().getId(),
                    cartItem.getProduct().getName(),
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice()
            );
            order.getItems().add(orderItem);
        });

        Order saved = orderRepository.save(order);
        cartService.clearCart(userEmail);

        return toOrderResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponseDTO> listOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::toOrderSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrder(String userEmail, Integer orderId) {
        Order order = orderRepository.findByIdAndUserEmail(orderId, userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado: " + orderId));
        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponseDTO cancelOrder(String userEmail, Integer orderId) {
        Order order = orderRepository.findByIdAndUserEmail(orderId, userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Somente pedidos com status PENDING podem ser cancelados");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return toOrderResponse(orderRepository.save(order));
    }

    private OrderResponseDTO toOrderResponse(Order order) {
        var items = order.getItems().stream()
                .map(i -> new OrderItemResponseDTO(
                        i.getId(),
                        i.getProductId(),
                        i.getProductName(),
                        i.getQuantity(),
                        i.getUnitPrice(),
                        i.getSubtotal()
                ))
                .toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getUserEmail(),
                order.getStatus(),
                order.getTotal(),
                order.getShippingAddress(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                items
        );
    }

    private OrderSummaryResponseDTO toOrderSummaryResponse(Order order) {
        return new OrderSummaryResponseDTO(
                order.getId(),
                order.getStatus(),
                order.getTotal(),
                order.getShippingAddress(),
                order.getCreatedAt()
        );
    }
}
