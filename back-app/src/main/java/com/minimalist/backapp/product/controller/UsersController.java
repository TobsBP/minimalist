package com.minimalist.backapp.product.controller;

import com.minimalist.backapp.product.common.DTO.UserDeleteDTO;
import com.minimalist.backapp.product.common.DTO.UserLoginDTO;
import com.minimalist.backapp.product.common.DTO.UserRegisterDTO;
import com.minimalist.backapp.product.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService){
        this.usersService = usersService;
    }

    @GetMapping
    public ResponseEntity getAll(){
        return ResponseEntity.ok(usersService.allUsers());
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody @Valid UserRegisterDTO data){
        return ResponseEntity.ok(usersService.register(data));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid UserLoginDTO data){
        return ResponseEntity.ok(usersService.login(data));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestBody @Valid UserDeleteDTO data){
        return ResponseEntity.ok(usersService.delete(data));
    }
}
