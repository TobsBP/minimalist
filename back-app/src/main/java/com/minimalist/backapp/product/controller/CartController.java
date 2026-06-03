package com.minimalist.backapp.product.controller;

import com.minimalist.backapp.product.common.DTO.CartAddItemRequestDTO;
import com.minimalist.backapp.product.common.DTO.CartResponseDTO;
import com.minimalist.backapp.product.common.DTO.CartUpdateItemRequestDTO;
import com.minimalist.backapp.product.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getCart(user.getUsername()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addItem(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CartAddItemRequestDTO request) {
        return ResponseEntity.ok(cartService.addItem(user.getUsername(), request));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDTO> updateItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Integer itemId,
            @Valid @RequestBody CartUpdateItemRequestDTO request) {
        return ResponseEntity.ok(cartService.updateItem(user.getUsername(), itemId, request));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponseDTO> removeItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Integer itemId) {
        return ResponseEntity.ok(cartService.removeItem(user.getUsername(), itemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
