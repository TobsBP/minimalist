package com.minimalist.backapp.product.entity.cartItem;

import com.minimalist.backapp.product.entity.cart.Cart;
import com.minimalist.backapp.product.entity.product.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class CartItemTest {

    private Product criarProduto(BigDecimal preco) {
        Product p = new Product();
        p.setPrice(preco);
        return p;
    }

    @Test
    @DisplayName("getSubtotal deve retornar unitPrice * quantity")
    void deveCalcularSubtotalCorretamente() {
        Cart cart = new Cart("user@email.com");
        Product produto = criarProduto(new BigDecimal("29.90"));

        CartItem item = new CartItem(cart, produto, 3);

        assertEquals(new BigDecimal("89.70"), item.getSubtotal());
    }

    @Test
    @DisplayName("getSubtotal com quantidade 1 deve retornar o próprio preço")
    void deveRetornarPrecoProprioPara1Unidade() {
        Cart cart = new Cart("user@email.com");
        Product produto = criarProduto(new BigDecimal("10.00"));

        CartItem item = new CartItem(cart, produto, 1);

        assertEquals(new BigDecimal("10.00"), item.getSubtotal());
    }

    @Test
    @DisplayName("Construtor deve copiar o preço do produto para unitPrice")
    void construtorDeveCopiarPrecoDoProduto() {
        Cart cart = new Cart("user@email.com");
        Product produto = criarProduto(new BigDecimal("49.99"));

        CartItem item = new CartItem(cart, produto, 2);

        assertEquals(new BigDecimal("49.99"), item.getUnitPrice());
    }

    @Test
    @DisplayName("Alterar preço do produto após criação não deve afetar unitPrice do item")
    void alterarPrecoProdutoNaoDeveAfetatUnitPrice() {
        Cart cart = new Cart("user@email.com");
        Product produto = criarProduto(new BigDecimal("50.00"));

        CartItem item = new CartItem(cart, produto, 1);
        produto.setPrice(new BigDecimal("99.99")); // muda preço depois

        assertEquals(new BigDecimal("50.00"), item.getUnitPrice());
    }
}