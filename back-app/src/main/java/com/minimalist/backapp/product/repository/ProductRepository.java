package com.minimalist.backapp.product.repository;

import com.minimalist.backapp.product.entity.product.Category;
import com.minimalist.backapp.product.entity.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategory(Category category);
}