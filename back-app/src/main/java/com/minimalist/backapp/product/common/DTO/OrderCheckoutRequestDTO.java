package com.minimalist.backapp.product.common.DTO;

import jakarta.validation.constraints.NotBlank;

public record OrderCheckoutRequestDTO(@NotBlank String shippingAddress) {
}
