package com.minimalist.backapp.product.entity.product;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

class CategoryTest {

    @ParameterizedTest
    @CsvSource({
            "CERAMICS, ceramics",
            "FURNITURE, furniture",
            "LIGHTING, lighting",
            "TEXTILES, textiles"
    })
    @DisplayName("getCategory deve retornar o label correto para cada valor")
    void deveRetornarLabelCorreto(String enumName, String labelEsperado) {
        Category category = Category.valueOf(enumName);
        assertEquals(labelEsperado, category.getCategory());
    }
}