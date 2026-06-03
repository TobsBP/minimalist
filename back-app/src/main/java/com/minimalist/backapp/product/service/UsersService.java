package com.minimalist.backapp.product.service;

import com.minimalist.backapp.product.common.DTO.UserDeleteDTO;
import com.minimalist.backapp.product.common.DTO.UserLoginDTO;
import com.minimalist.backapp.product.common.DTO.UserLoginResponseDTO;
import com.minimalist.backapp.product.common.DTO.UserRegisterDTO;
import com.minimalist.backapp.product.entity.users.UserRole;
import com.minimalist.backapp.product.entity.users.Users;
import com.minimalist.backapp.product.repository.UsersRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

import static com.minimalist.backapp.product.common.validate.CPFValidate.isCPF;
import static com.minimalist.backapp.product.common.validate.CPFValidate.sendCPF;

@Service
public class UsersService {
    private final UsersRepository usersRepository;

    private AuthenticationManager authenticationManager;

    private TokenService tokenService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[a-z]+$");

    public UsersService(UsersRepository usersRepository, TokenService tokenService, AuthenticationManager authenticationManager){
        this.usersRepository = usersRepository;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    public List<Users> allUsers(){
        return usersRepository.findAll();
    }

    public String register(UserRegisterDTO dto){
        String encryptedPassword = new BCryptPasswordEncoder().encode(dto.password());
        Users user = new Users(dto.name(),
                validateEmail(dto.email()),
                encryptedPassword,
                dto.role(),
                validateCPF(dto.cpf()),
                dto.dateOfBirth(),
                dto.phone(),
                dto.address(),
                dto.nationality());
        usersRepository.save(user);
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.email(),dto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((Users) auth.getPrincipal());

        return token;
    }

    public UserLoginResponseDTO login (UserLoginDTO dto){
        var usernamePassword = new UsernamePasswordAuthenticationToken(dto.email(),dto.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((Users) auth.getPrincipal());

        return new UserLoginResponseDTO(token);
    }

    public String delete(UserDeleteDTO dto){
        usersRepository.deleteById(dto.id());
        return "Usuário Deletado com Sucesso!";
    }

    public Optional<Users> findById(UUID id) {
        return usersRepository.findById(id);
    }

    public Optional<Users> findByEmail(String email) {
        return usersRepository.findByEmailIgnoreCase(email);
    }

    public List<Users> findByRole(UserRole role) {
        return usersRepository.findByRole(role);
    }

    public boolean existsByEmail(String email) {
        return usersRepository.existsByEmail(email);
    }

    public boolean existsByCpf(String cpf) {
        return usersRepository.existsByCpf(cpf);
    }

    public void deleteById(UUID id) {
        usersRepository.deleteById(id);
    }

    public void changePassword(UUID id, String newPassword) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        usersRepository.save(user);
    }

    public void changeRole(UUID id, UserRole newRole) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        user.setRole(newRole);
        usersRepository.save(user);
    }

    private String validateEmail(String email){
        if (email == null || !EMAIL_PATTERN.matcher(email).matches() || usersRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("Email Invalido por favor digite um email valido");
        }
        return email;
    }

    private String validateCPF(String cpf){
        if(cpf == null || !isCPF(cpf)){
            throw new RuntimeException("CPF Invalido");
        }else{
            return sendCPF(cpf);
        }
    }
}
