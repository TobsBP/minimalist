package com.minimalist.backapp.product.common.DTO;

import java.math.BigDecimal;

public record CartItemResponseDTO(Integer id,
                                  Integer productId,
                                  String productName,
                                  String productImageUrl,
                                  Integer quantity,
                                  BigDecimal unitPrice,
                                  BigDecimal subtotal) {
}
