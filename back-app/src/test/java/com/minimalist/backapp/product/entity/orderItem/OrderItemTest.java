package com.minimalist.backapp.product.entity.orderItem;

import com.minimalist.backapp.product.entity.order.Order;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class OrderItemTest {

    private OrderItem criarItem(String preco, int quantidade) {
        Order order = new Order();
        return new OrderItem(order, 1, "Produto Teste", quantidade, new BigDecimal(preco));
    }

    @Test
    @DisplayName("getSubtotal deve retornar unitPrice * quantity")
    void deveCalcularSubtotalCorretamente() {
        OrderItem item = criarItem("29.90", 3);
        assertEquals(new BigDecimal("89.70"), item.getSubtotal());
    }

    @Test
    @DisplayName("getSubtotal com quantidade 1 deve retornar o próprio preço")
    void deveRetornarPrecoProprioPara1Unidade() {
        OrderItem item = criarItem("10.00", 1);
        assertEquals(new BigDecimal("10.00"), item.getSubtotal());
    }

    @Test
    @DisplayName("Construtor deve persistir todos os campos corretamente")
    void construtorDevePreencherTodosOsCampos() {
        Order order = new Order();
        OrderItem item = new OrderItem(order, 42, "Tênis Nike", 2, new BigDecimal("199.99"));

        assertAll(
                () -> assertEquals(order, item.getOrder()),
                () -> assertEquals(42, item.getProductId()),
                () -> assertEquals("Tênis Nike", item.getProductName()),
                () -> assertEquals(2, item.getQuantity()),
                () -> assertEquals(new BigDecimal("199.99"), item.getUnitPrice())
        );
    }
}