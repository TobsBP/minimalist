package com.minimalist.backapp.product.controller;

import com.minimalist.backapp.product.common.DTO.OrderCheckoutRequestDTO;
import com.minimalist.backapp.product.common.DTO.OrderResponseDTO;
import com.minimalist.backapp.product.common.DTO.OrderSummaryResponseDTO;
import com.minimalist.backapp.product.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponseDTO> checkout(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody OrderCheckoutRequestDTO request) {
        return ResponseEntity.ok(orderService.checkout(user.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<OrderSummaryResponseDTO>> listOrders(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.listOrders(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrder(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrder(user.getUsername(), id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderResponseDTO> cancelOrder(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Integer id) {
        return ResponseEntity.ok(orderService.cancelOrder(user.getUsername(), id));
    }
}
