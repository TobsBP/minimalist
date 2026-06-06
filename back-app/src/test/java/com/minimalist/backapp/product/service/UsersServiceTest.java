package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.*;
import com.minimalist.backapp.product.entity.users.UserRole;
import com.minimalist.backapp.product.entity.users.Users;
import com.minimalist.backapp.product.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UsersService")
class UsersServiceTest {

    @Mock private UsersRepository usersRepository;
    @Mock private TokenService tokenService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private UsersService usersService;

    private Users user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new Users();
        user.setEmail("gabriel@minimalist.com");
        user.setPassword("$2a$10$hashed");
        user.setRole(UserRole.CUSTOMER);
    }

    @Nested
    @DisplayName("allUsers()")
    class AllUsers {

        @Test
        @DisplayName("deve retornar todos os usuários")
        void shouldReturnAllUsers() {
            when(usersRepository.findAll()).thenReturn(List.of(user));

            List<Users> result = usersService.allUsers();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getEmail()).isEqualTo("gabriel@minimalist.com");
        }

        @Test
        @DisplayName("deve retornar lista vazia quando não há usuários")
        void shouldReturnEmptyList() {
            when(usersRepository.findAll()).thenReturn(List.of());

            assertThat(usersService.allUsers()).isEmpty();
        }
    }

    @Nested
    @DisplayName("register()")
    class Register {

        @Test
        @DisplayName("deve lançar exceção quando email já está cadastrado")
        void shouldThrowWhenEmailAlreadyExists() {
            UserRegisterDTO dto = buildRegisterDTO("gabriel@minimalist.com", "123.456.789-09");
            when(usersRepository.findByEmailIgnoreCase("gabriel@minimalist.com"))
                    .thenReturn(Optional.of(user));

            assertThatThrownBy(() -> usersService.register(dto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Email Invalido");
        }

        @Test
        @DisplayName("deve lançar exceção quando CPF é inválido")
        void shouldThrowWhenCpfIsInvalid() {
            UserRegisterDTO dto = buildRegisterDTO("novo@minimalist.com", "000.000.000-00");
            when(usersRepository.findByEmailIgnoreCase("novo@minimalist.com")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usersService.register(dto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("CPF Invalido");
        }

        @Test
        @DisplayName("deve lançar exceção quando CPF é nulo")
        void shouldThrowWhenCpfIsNull() {
            UserRegisterDTO dto = buildRegisterDTO("novo@minimalist.com", null);
            when(usersRepository.findByEmailIgnoreCase("novo@minimalist.com")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usersService.register(dto))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("CPF Invalido");
        }
    }

    @Nested
    @DisplayName("login()")
    class Login {

        @Test
        @DisplayName("deve retornar token JWT quando credenciais são válidas")
        void shouldReturnTokenForValidCredentials() {
            UserLoginDTO dto = new UserLoginDTO("gabriel@minimalist.com", "senha123");
            Authentication auth = mock(Authentication.class);

            when(authenticationManager.authenticate(any())).thenReturn(auth);
            when(auth.getPrincipal()).thenReturn(user);
            when(tokenService.generateToken(user)).thenReturn("jwt-token");

            UserLoginResponseDTO response = usersService.login(dto);

            assertThat(response.token()).isEqualTo("jwt-token");
        }

        @Test
        @DisplayName("deve lançar exceção quando credenciais são inválidas")
        void shouldThrowWhenCredentialsAreInvalid() {
            UserLoginDTO dto = new UserLoginDTO("gabriel@minimalist.com", "senha-errada");
            when(authenticationManager.authenticate(any()))
                    .thenThrow(new BadCredentialsException("Credenciais inválidas"));

            assertThatThrownBy(() -> usersService.login(dto))
                    .isInstanceOf(BadCredentialsException.class);
        }

        @Test
        @DisplayName("deve montar UsernamePasswordAuthenticationToken corretamente")
        void shouldBuildAuthTokenWithCorrectCredentials() {
            UserLoginDTO dto = new UserLoginDTO("gabriel@minimalist.com", "senha123");
            Authentication auth = mock(Authentication.class);
            when(authenticationManager.authenticate(any())).thenReturn(auth);
            when(auth.getPrincipal()).thenReturn(user);
            when(tokenService.generateToken(any())).thenReturn("token");

            usersService.login(dto);

            verify(authenticationManager).authenticate(
                    argThat(a -> a instanceof UsernamePasswordAuthenticationToken &&
                                 a.getPrincipal().equals("gabriel@minimalist.com"))
            );
        }
    }

    @Nested
    @DisplayName("delete()")
    class Delete {

        @Test
        @DisplayName("deve deletar usuário e retornar mensagem de sucesso")
        void shouldDeleteUserAndReturnMessage() {
            UserDeleteDTO dto = new UserDeleteDTO(userId);
            doNothing().when(usersRepository).deleteById(userId);

            String result = usersService.delete(dto);

            assertThat(result).isEqualTo("Usuário Deletado com Sucesso!");
            verify(usersRepository).deleteById(userId);
        }
    }

    @Nested
    @DisplayName("findById()")
    class FindById {

        @Test
        @DisplayName("deve retornar Optional com usuário quando ID existe")
        void shouldReturnUserWhenIdExists() {
            when(usersRepository.findById(userId)).thenReturn(Optional.of(user));

            Optional<Users> result = usersService.findById(userId);

            assertThat(result).isPresent();
            assertThat(result.get().getEmail()).isEqualTo("gabriel@minimalist.com");
        }

        @Test
        @DisplayName("deve retornar Optional vazio quando ID não existe")
        void shouldReturnEmptyWhenIdNotFound() {
            when(usersRepository.findById(userId)).thenReturn(Optional.empty());

            assertThat(usersService.findById(userId)).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByEmail()")
    class FindByEmail {

        @Test
        @DisplayName("deve retornar usuário quando email existe (case-insensitive)")
        void shouldReturnUserByEmail() {
            when(usersRepository.findByEmailIgnoreCase("GABRIEL@minimalist.com"))
                    .thenReturn(Optional.of(user));

            Optional<Users> result = usersService.findByEmail("GABRIEL@minimalist.com");

            assertThat(result).isPresent();
        }

        @Test
        @DisplayName("deve retornar Optional vazio quando email não existe")
        void shouldReturnEmptyWhenEmailNotFound() {
            when(usersRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());

            assertThat(usersService.findByEmail("desconhecido@minimalist.com")).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByRole()")
    class FindByRole {

        @Test
        @DisplayName("deve retornar usuários com a role informada")
        void shouldReturnUsersByRole() {
            when(usersRepository.findByRole(UserRole.ADMIN)).thenReturn(List.of(user));

            List<Users> result = usersService.findByRole(UserRole.ADMIN);

            assertThat(result).hasSize(1);
        }
    }

    @Nested
    @DisplayName("existsByEmail() e existsByCpf()")
    class Exists {

        @Test
        @DisplayName("deve retornar true quando email já existe")
        void shouldReturnTrueWhenEmailExists() {
            when(usersRepository.existsByEmail("gabriel@minimalist.com")).thenReturn(true);

            assertThat(usersService.existsByEmail("gabriel@minimalist.com")).isTrue();
        }

        @Test
        @DisplayName("deve retornar false quando email não existe")
        void shouldReturnFalseWhenEmailNotExists() {
            when(usersRepository.existsByEmail(anyString())).thenReturn(false);

            assertThat(usersService.existsByEmail("novo@minimalist.com")).isFalse();
        }

        @Test
        @DisplayName("deve retornar true quando CPF já existe")
        void shouldReturnTrueWhenCpfExists() {
            when(usersRepository.existsByCpf("123.456.789-09")).thenReturn(true);

            assertThat(usersService.existsByCpf("123.456.789-09")).isTrue();
        }
    }

    @Nested
    @DisplayName("changePassword()")
    class ChangePassword {

        @Test
        @DisplayName("deve alterar a senha com hash bcrypt")
        void shouldChangePasswordWithBcryptHash() {
            when(usersRepository.findById(userId)).thenReturn(Optional.of(user));

            usersService.changePassword(userId, "novaSenha123");

            verify(usersRepository).save(argThat(u ->
                    u.getPassword() != null &&
                    u.getPassword().startsWith("$2a$")
            ));
        }

        @Test
        @DisplayName("deve lançar RuntimeException quando usuário não encontrado")
        void shouldThrowWhenUserNotFound() {
            when(usersRepository.findById(userId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usersService.changePassword(userId, "novaSenha"))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Usuario nao encontrado");
        }
    }

    @Nested
    @DisplayName("changeRole()")
    class ChangeRole {

        @Test
        @DisplayName("deve alterar role do usuário para ADMIN")
        void shouldChangeRoleToAdmin() {
            when(usersRepository.findById(userId)).thenReturn(Optional.of(user));

            usersService.changeRole(userId, UserRole.ADMIN);

            verify(usersRepository).save(argThat(u -> u.getRole() == UserRole.ADMIN));
        }

        @Test
        @DisplayName("deve lançar RuntimeException quando usuário não encontrado")
        void shouldThrowWhenUserNotFound() {
            when(usersRepository.findById(userId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usersService.changeRole(userId, UserRole.ADMIN))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Usuario nao encontrado");
        }
    }

    @Nested
    @DisplayName("deleteById()")
    class DeleteById {

        @Test
        @DisplayName("deve deletar usuário pelo ID sem retorno")
        void shouldDeleteById() {
            doNothing().when(usersRepository).deleteById(userId);

            usersService.deleteById(userId);

            verify(usersRepository).deleteById(userId);
        }
    }

    private UserRegisterDTO buildRegisterDTO(String email, String cpf) {
        return new UserRegisterDTO(
                "Gabriel",
                email,
                "Senha@123",
                UserRole.CUSTOMER,
                cpf,
                LocalDate.of(1998, 5, 20),
                "35999999999",
                "Rua das Flores, 10",
                "Brasileiro"
        );
    }
}
