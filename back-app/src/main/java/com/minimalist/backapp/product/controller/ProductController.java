package com.minimalist.backapp.product.controller;

import com.minimalist.backapp.product.common.DTO.AddProductDTO;
import com.minimalist.backapp.product.entity.product.Product;
import com.minimalist.backapp.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.allProduct());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.findProduct(id));
    }

    @PostMapping
    public ResponseEntity<String> createProduct(@RequestBody AddProductDTO data) {
        return ResponseEntity.ok(productService.addProduct(data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletProduct(@PathVariable Integer id){
        return ResponseEntity.ok(productService.deleteProduct(id));
    }

}