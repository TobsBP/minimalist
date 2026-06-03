package com.minimalist.backapp.product.common.DTO;

import com.minimalist.backapp.product.entity.order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(Integer id,
                               String userEmail,
                               OrderStatus status,
                               BigDecimal total,
                               String shippingAddress,
                               LocalDateTime createdAt,
                               LocalDateTime updatedAt,
                               List<OrderItemResponseDTO> items) {
}
