package com.minimalist.backapp.product.common.DTO;

import java.math.BigDecimal;

public record OrderItemResponseDTO(Integer id,
                                   Integer productId,
                                   String productName,
                                   Integer quantity,
                                   BigDecimal unitPrice,
                                   BigDecimal subtotal) {
}
