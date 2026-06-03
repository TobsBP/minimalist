package com.minimalist.backapp.product.common.DTO;

import com.minimalist.backapp.product.entity.product.Category;

import java.math.BigDecimal;

public record AddProductDTO(String name,
                            String material,
                            BigDecimal price,
                            String imageUrl,
                            Category category) {
}
