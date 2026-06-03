package com.minimalist.backapp.product.common.DTO;

import com.minimalist.backapp.product.entity.order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderSummaryResponseDTO(Integer id,
                                      OrderStatus status,
                                      BigDecimal total,
                                      String shippingAddress,
                                      LocalDateTime createdAt) {
}
