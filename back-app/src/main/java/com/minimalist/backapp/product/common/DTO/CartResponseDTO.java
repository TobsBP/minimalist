package com.minimalist.backapp.product.common.DTO;

import java.math.BigDecimal;
import java.util.List;

public record CartResponseDTO(Integer id,
                              String userEmail,
                              List<CartItemResponseDTO> items,
                              BigDecimal total) {
}
