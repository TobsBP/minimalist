package com.minimalist.backapp.product.entity.product;

public enum Category {
    CERAMICS("ceramics"),
    FURNITURE("furniture"),
    LIGHTING("lighting"),
    TEXTILES("textiles");

    private final String category;

    Category(String category){
        this.category = category;
    }

    public String getCategory(){
        return category;
    }
}