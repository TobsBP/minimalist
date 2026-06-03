package com.minimalist.backapp.product.entity.cart;

import com.minimalist.backapp.product.entity.cartItem.CartItem;
import com.minimalist.backapp.product.entity.product.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CartTest {

    private CartItem criarItem(Cart cart, String preco, int quantidade) {
        Product p = new Product();
        p.setPrice(new BigDecimal(preco));
        return new CartItem(cart, p, quantidade);
    }

    @Test
    @DisplayName("getTotal deve retornar ZERO para carrinho vazio")
    void deveRetornarZeroParaCarrinhoVazio() {
        Cart cart = new Cart("user@email.com");

        assertEquals(BigDecimal.ZERO, cart.getTotal());
    }

    @Test
    @DisplayName("getTotal deve somar subtotais de todos os itens")
    void deveSomarSubtotaisDeTodosOsItens() {
        Cart cart = new Cart("user@email.com");

        // 29.90 * 3 = 89.70
        // 10.00 * 1 = 10.00
        // 5.50 * 2 = 11.00
        // total = 110.70
        cart.getItems().addAll(List.of(
                criarItem(cart, "29.90", 3),
                criarItem(cart, "10.00", 1),
                criarItem(cart, "5.50", 2)
        ));

        assertEquals(new BigDecimal("110.70"), cart.getTotal());
    }

    @Test
    @DisplayName("getTotal com um único item deve retornar subtotal desse item")
    void deveRetornarSubtotalComUmUnicoItem() {
        Cart cart = new Cart("user@email.com");
        cart.getItems().add(criarItem(cart, "29.90", 3));

        assertEquals(new BigDecimal("89.70"), cart.getTotal());
    }

    @Test
    @DisplayName("Construtor com email deve setar userEmail corretamente")
    void construtorDeveSetarUserEmail() {
        Cart cart = new Cart("test@email.com");

        assertEquals("test@email.com", cart.getUserEmail());
    }

    @Test
    @DisplayName("Carrinho novo deve inicializar lista de itens vazia")
    void novoCarrinhoDeveInicializarListaVazia() {
        Cart cart = new Cart("user@email.com");

        assertNotNull(cart.getItems());
        assertTrue(cart.getItems().isEmpty());
    }
}