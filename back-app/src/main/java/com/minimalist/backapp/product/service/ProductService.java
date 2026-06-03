package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.AddProductDTO;
import com.minimalist.backapp.product.entity.product.Product;
import com.minimalist.backapp.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public List<Product> allProduct(){
        return productRepository.findAll();
    }

    public Product findProduct(Integer id){
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Item não encontrado"));
    }

    public String addProduct(AddProductDTO data){
        Product product = new Product();
        product.setName(data.name());
        product.setMaterial(data.material());
        product.setPrice(data.price());
        product.setImageUrl(data.imageUrl());
        product.setCategory(data.category());

        productRepository.save(product);

        return "Produto Criado com sucesso";
    }

    public String deleteProduct(Integer id){
        productRepository.deleteById(id);
        return "Produto deletado com sucesso";
    }
}