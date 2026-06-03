package com.minimalist.backapp.product.common.DTO;

import com.minimalist.backapp.product.entity.users.UserRole;

import java.time.LocalDate;

public record UserRegisterDTO(String name,
                              String email,
                              String password,
                              UserRole role,
                              String cpf,
                              LocalDate dateOfBirth,
                              String phone,
                              String address,
                              String nationality) {
}
