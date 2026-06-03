package com.minimalist.backapp.product.repository;

import com.minimalist.backapp.product.entity.users.UserRole;
import com.minimalist.backapp.product.entity.users.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, UUID> {
    UserDetails findByEmail(String email);

    Optional<Users> findByEmailIgnoreCase(String email);

    Optional<Users> findByCpf(String cpf);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    List<Users> findByRole(UserRole role);
}