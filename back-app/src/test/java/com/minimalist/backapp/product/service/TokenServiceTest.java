package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.entity.users.UserRole;
import com.minimalist.backapp.product.entity.users.Users;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TokenService")
class TokenServiceTest {

    private TokenService tokenService;

    private Users user;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "test-secret-key-minimalist-2024");

        user = new Users();
        user.setEmail("gabriel@minimalist.com");
        user.setRole(UserRole.CUSTOMER);
    }

    @Nested
    @DisplayName("generateToken()")
    class GenerateToken {

        @Test
        @DisplayName("deve gerar token não nulo e não vazio")
        void shouldGenerateNonBlankToken() {
            String token = tokenService.generateToken(user);

            assertThat(token).isNotBlank();
        }

        @Test
        @DisplayName("deve gerar token com formato JWT (3 partes separadas por ponto)")
        void shouldGenerateValidJwtFormat() {
            String token = tokenService.generateToken(user);

            assertThat(token.split("\\.")).hasSize(3);
        }

        @Test
        @DisplayName("deve gerar tokens diferentes a cada chamada (por causa do timestamp)")
        void shouldGenerateDifferentTokensOnEachCall() throws InterruptedException {
            String token1 = tokenService.generateToken(user);
            Thread.sleep(1000);
            String token2 = tokenService.generateToken(user);

            assertThat(token1).isNotNull();
            assertThat(token2).isNotNull();
        }

    }

    @Nested
    @DisplayName("validateToken()")
    class ValidateToken {

        @Test
        @DisplayName("deve retornar o email do subject para token válido")
        void shouldReturnEmailForValidToken() {
            String token = tokenService.generateToken(user);

            String subject = tokenService.validateToken(token);

            assertThat(subject).isEqualTo("gabriel@minimalist.com");
        }

        @Test
        @DisplayName("deve retornar string vazia para token inválido")
        void shouldReturnEmptyStringForInvalidToken() {
            String result = tokenService.validateToken("token.invalido.aqui");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("deve retornar string vazia para token vazio")
        void shouldReturnEmptyStringForBlankToken() {
            String result = tokenService.validateToken("");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("deve retornar string vazia para token assinado com secret diferente")
        void shouldReturnEmptyStringForTokenWithWrongSecret() {
            TokenService otherService = new TokenService();
            ReflectionTestUtils.setField(otherService, "secret", "outro-secret-completamente-diferente");
            String foreignToken = otherService.generateToken(user);

            String result = tokenService.validateToken(foreignToken);

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("token gerado e validado deve conter o email correto")
        void roundTripShouldPreserveEmail() {
            Users outro = new Users();
            outro.setEmail("admin@minimalist.com");
            outro.setRole(UserRole.ADMIN);

            String token = tokenService.generateToken(outro);
            String subject = tokenService.validateToken(token);

            assertThat(subject).isEqualTo("admin@minimalist.com");
        }
    }
}