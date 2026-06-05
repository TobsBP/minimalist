package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.entity.users.UserRole;
import com.minimalist.backapp.product.entity.users.Users;
import com.minimalist.backapp.product.repository.UsersRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthorizationService")
class AuthorizationServiceTest {

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private AuthorizationService authorizationService;

    @Nested
    @DisplayName("loadUserByUsername()")
    class LoadUserByUsername {

        @Test
        @DisplayName("deve retornar UserDetails quando email existe")
        void shouldReturnUserDetailsWhenEmailExists() {
            Users user = buildUser("gabriel@minimalist.com", UserRole.CUSTOMER);
            when(usersRepository.findByEmail("gabriel@minimalist.com")).thenReturn(user);

            UserDetails result = authorizationService.loadUserByUsername("gabriel@minimalist.com");

            assertThat(result).isNotNull();
            assertThat(result.getUsername()).isEqualTo("gabriel@minimalist.com");
            verify(usersRepository).findByEmail("gabriel@minimalist.com");
        }

        @Test
        @DisplayName("deve retornar UserDetails com role ADMIN corretamente")
        void shouldReturnAdminUserDetails() {
            Users admin = buildUser("admin@minimalist.com", UserRole.ADMIN);
            when(usersRepository.findByEmail("admin@minimalist.com")).thenReturn(admin);

            UserDetails result = authorizationService.loadUserByUsername("admin@minimalist.com");

            assertThat(result.getAuthorities())
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        @Test
        @DisplayName("deve retornar null quando usuário não existe (comportamento do repositório)")
        void shouldReturnNullWhenUserNotFound() {
            when(usersRepository.findByEmail("naoexiste@minimalist.com")).thenReturn(null);

            UserDetails result = authorizationService.loadUserByUsername("naoexiste@minimalist.com");

            assertThat(result).isNull();
        }

        @Test
        @DisplayName("deve delegar exatamente para findByEmail do repositório")
        void shouldDelegateToRepository() {
            Users user = buildUser("user@minimalist.com", UserRole.CUSTOMER);
            when(usersRepository.findByEmail(any())).thenReturn(user);

            authorizationService.loadUserByUsername("user@minimalist.com");

            verify(usersRepository, times(1)).findByEmail("user@minimalist.com");
            verifyNoMoreInteractions(usersRepository);
        }
    }

    private Users buildUser(String email, UserRole role) {
        Users user = new Users();
        user.setEmail(email);
        user.setPassword("$2a$10$hashed");
        user.setRole(role);
        return user;
    }
}
