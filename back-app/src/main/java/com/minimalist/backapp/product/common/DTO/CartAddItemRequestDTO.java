package com.minimalist.backapp.product.common.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartAddItemRequestDTO(@NotNull Integer productId,
                                    @NotNull @Min(1) Integer quantity) {
}
