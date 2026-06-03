package com.minimalist.backapp.product.entity.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private Integer id;
    @NotBlank
    private String name;
    @NotBlank
    private String material;
    @NotNull
    private BigDecimal price;
    @NotBlank
    private String imageUrl;
    @Enumerated(EnumType.STRING)
    private Category category;
}