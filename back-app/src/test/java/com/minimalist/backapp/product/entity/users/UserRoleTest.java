package com.minimalist.backapp.product.entity.users;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

class UserRoleTest {

    @ParameterizedTest
    @CsvSource({
            "ADMIN, admin",
            "AGENT, agent",
            "CUSTOMER, customer"
    })
    @DisplayName("getRole deve retornar o label correto para cada valor")
    void deveRetornarLabelCorreto(String enumName, String labelEsperado) {
        UserRole role = UserRole.valueOf(enumName);
        assertEquals(labelEsperado, role.getRole());
    }
}