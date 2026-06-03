package com.minimalist.backapp.product.entity.users;

public enum UserRole {
    ADMIN("admin"),
    AGENT("agent"),
    CUSTOMER("customer");

    private final String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
