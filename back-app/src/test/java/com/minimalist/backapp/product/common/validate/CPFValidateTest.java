package com.minimalist.backapp.product.common.validate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class CPFValidateTest {

    @ParameterizedTest
    @ValueSource(strings = {
            "52998224725",
            "62749146763",
            "02320519505"
    })
    @DisplayName("Deve retornar TRUE para CPFs válidos")
    void deveRetornarTrueParaCpfsValidos(String cpf) {
        assertTrue(CPFValidate.isCPF(cpf));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "00000000000", "11111111111", "22222222222", "33333333333",
            "44444444444", "55555555555", "66666666666", "77777777777",
            "88888888888", "99999999999"
    })
    @DisplayName("Deve retornar FALSE para CPFs com todos os dígitos iguais")
    void deveRetornarFalseParaCpfsComDigitosRepetidos(String cpf) {
        assertFalse(CPFValidate.isCPF(cpf));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "52998224724",  // último dígito errado (era 5)
            "10263321742",  // último dígito errado (era 3)
    })
    @DisplayName("Deve retornar FALSE para CPFs com dígito verificador errado")
    void deveRetornarFalseParaCpfComDigitoVerificadorErrado(String cpf) {
        assertFalse(CPFValidate.isCPF(cpf));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "123",           // muito curto
            "123456789012"   // muito longo
    })
    @DisplayName("Deve retornar FALSE para CPFs com tamanho incorreto")
    void deveRetornarFalseParaCpfComTamanhoIncorreto(String cpf) {
        assertFalse(CPFValidate.isCPF(cpf));
    }

    @Test
    @DisplayName("Deve lançar NullPointerException para CPF nulo (comportamento atual não protegido)")
    void deveLancarExcecaoParaCpfNulo() {
        assertThrows(NullPointerException.class, () -> CPFValidate.isCPF(null));
    }

    @Test
    @DisplayName("Deve formatar corretamente um CPF de 11 dígitos")
    void deveFormatarCpfCorretamente() {
        assertEquals("529.982.247-25", CPFValidate.sendCPF("52998224725"));
    }

    @Test
    @DisplayName("Deve lançar exceção ao formatar CPF com menos de 11 caracteres")
    void deveLancarExcecaoAoFormatarCpfCurto() {
        assertThrows(StringIndexOutOfBoundsException.class,
                () -> CPFValidate.sendCPF("123"));
    }
}