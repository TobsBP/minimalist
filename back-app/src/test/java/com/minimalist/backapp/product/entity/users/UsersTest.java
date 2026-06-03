package com.minimalist.backapp.product.entity.users;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UsersTest {

    private Users criarUsuario(UserRole role) {
        return new Users("Igor", "igor@email.com", "senha123", role,
                "52998224725", LocalDate.of(2000, 1, 1),
                "11999999999", "Rua A, 1", "Brasileiro");
    }

    // --- getAuthorities ---

    @Test
    @DisplayName("ADMIN deve ter as 3 roles")
    void adminDeveTerTresRoles() {
        Collection<? extends GrantedAuthority> authorities =
                criarUsuario(UserRole.ADMIN).getAuthorities();

        assertEquals(3, authorities.size());
        assertTrue(temRole(authorities, "ROLE_ADMIN"));
        assertTrue(temRole(authorities, "ROLE_AGENT"));
        assertTrue(temRole(authorities, "ROLE_CUSTOMER"));
    }

    @Test
    @DisplayName("AGENT deve ter ROLE_AGENT e ROLE_CUSTOMER")
    void agentDeveTerDuasRoles() {
        Collection<? extends GrantedAuthority> authorities =
                criarUsuario(UserRole.AGENT).getAuthorities();

        assertEquals(2, authorities.size());
        assertFalse(temRole(authorities, "ROLE_ADMIN"));
        assertTrue(temRole(authorities, "ROLE_AGENT"));
        assertTrue(temRole(authorities, "ROLE_CUSTOMER"));
    }

    @Test
    @DisplayName("CUSTOMER deve ter apenas ROLE_CUSTOMER")
    void customerDeveTerApenasUmaRole() {
        Collection<? extends GrantedAuthority> authorities =
                criarUsuario(UserRole.CUSTOMER).getAuthorities();

        assertEquals(1, authorities.size());
        assertFalse(temRole(authorities, "ROLE_ADMIN"));
        assertFalse(temRole(authorities, "ROLE_AGENT"));
        assertTrue(temRole(authorities, "ROLE_CUSTOMER"));
    }

    // --- getUsername ---

    @Test
    @DisplayName("getUsername deve retornar o email")
    void getUsernameDeveRetornarEmail() {
        Users user = criarUsuario(UserRole.CUSTOMER);
        assertEquals("igor@email.com", user.getUsername());
    }

    // --- construtor ---

    @Test
    @DisplayName("Construtor deve preencher createdAt automaticamente")
    void construtorDevePreencherCreatedAt() {
        Users user = criarUsuario(UserRole.CUSTOMER);
        assertNotNull(user.getCreatedAt());
    }

    @Test
    @DisplayName("UserDetails flags devem retornar true")
    void userDetailsFlagsDevemSerTrue() {
        Users user = criarUsuario(UserRole.CUSTOMER);
        assertAll(
                () -> assertTrue(user.isAccountNonExpired()),
                () -> assertTrue(user.isAccountNonLocked()),
                () -> assertTrue(user.isCredentialsNonExpired()),
                () -> assertTrue(user.isEnabled())
        );
    }

    // helper
    private boolean temRole(Collection<? extends GrantedAuthority> authorities, String role) {
        return authorities.stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }
}