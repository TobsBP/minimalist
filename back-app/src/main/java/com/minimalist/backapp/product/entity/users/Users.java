package com.minimalist.backapp.product.entity.users;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @NotBlank
    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(unique = true, length = 14)
    private String cpf;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(length = 80)
    private String nationality;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Users(String name, String email, String password, UserRole role,
                 String cpf, LocalDate dateOfBirth, String phone,
                 String address, String nationality) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.cpf = cpf;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.address = address;
        this.nationality = nationality;
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (this.role) {
            case ADMIN -> List.of(
                    new SimpleGrantedAuthority("ROLE_ADMIN"),
                    new SimpleGrantedAuthority("ROLE_AGENT"),
                    new SimpleGrantedAuthority("ROLE_CUSTOMER")
            );
            case AGENT -> List.of(
                    new SimpleGrantedAuthority("ROLE_AGENT"),
                    new SimpleGrantedAuthority("ROLE_CUSTOMER")
            );
            case CUSTOMER -> List.of(
                    new SimpleGrantedAuthority("ROLE_CUSTOMER")
            );
        };
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override public boolean isAccountNonExpired() {
        return true;
    }
    @Override public boolean isAccountNonLocked() {
        return true;
    }
    @Override public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override public boolean isEnabled() {
        return true;
    }
}
