package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.CartAddItemRequestDTO;
import com.minimalist.backapp.product.common.DTO.CartItemResponseDTO;
import com.minimalist.backapp.product.common.DTO.CartResponseDTO;
import com.minimalist.backapp.product.common.DTO.CartUpdateItemRequestDTO;
import com.minimalist.backapp.product.entity.cart.Cart;
import com.minimalist.backapp.product.entity.cartItem.CartItem;
import com.minimalist.backapp.product.entity.product.Product;
import com.minimalist.backapp.product.repository.CartItemRepository;
import com.minimalist.backapp.product.repository.CartRepository;
import com.minimalist.backapp.product.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public CartResponseDTO getCart(String userEmail) {
        Cart cart = findOrCreateCart(userEmail);
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponseDTO addItem(String userEmail, CartAddItemRequestDTO request) {
        Cart cart = findOrCreateCart(userEmail);
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + request.productId()));

        cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + request.quantity()),
                        () -> cart.getItems().add(new CartItem(cart, product, request.quantity()))
                );

        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO updateItem(String userEmail, Integer itemId, CartUpdateItemRequestDTO request) {
        Cart cart = findOrCreateCart(userEmail);
        CartItem item = cartItemRepository.findById(itemId)
                .filter(i -> i.getCart().getId().equals(cart.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Item não encontrado: " + itemId));

        item.setQuantity(request.quantity());
        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDTO removeItem(String userEmail, Integer itemId) {
        Cart cart = findOrCreateCart(userEmail);
        CartItem item = cartItemRepository.findById(itemId)
                .filter(i -> i.getCart().getId().equals(cart.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Item não encontrado: " + itemId));

        cart.getItems().remove(item);
        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String userEmail) {
        Cart cart = findOrCreateCart(userEmail);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart findOrCreateCart(String userEmail) {
        return cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> cartRepository.save(new Cart(userEmail)));
    }

    private CartResponseDTO toCartResponse(Cart cart) {
        var items = cart.getItems().stream()
                .map(i -> new CartItemResponseDTO(
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getProduct().getImageUrl(),
                        i.getQuantity(),
                        i.getUnitPrice(),
                        i.getSubtotal()
                ))
                .toList();

        return new CartResponseDTO(
                cart.getId(),
                cart.getUserEmail(),
                items,
                cart.getTotal()
        );
    }
}
